using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.EntityFrameworkCore;
using CERTHB2B.Data;
using CERTHB2B.Models;
using CERTHB2B.Data.Seeds;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using CERTHB2B.Services;
using IdentityServer4.Services;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Http;
using Microsoft.IdentityModel.Logging;
using System;
using System.Threading.Tasks;
using CERTHB2B.Utils;
using Microsoft.Extensions.Options;

namespace CERTHB2B
{
    public class Startup
    {
        public Startup(IConfiguration configuration, IHostEnvironment env)
        {
            Configuration = configuration;
            Environment = env;

            

            // Console.WriteLine($"ApplicationName: {env.ApplicationName}");
            // Console.WriteLine($"ContentRootPath: {env.ContentRootPath}");
            // Console.WriteLine($"EnvironmentName: {env.EnvironmentName}");

            

            // var sgc = configuration.GetSection("SendGrid");

            // Console.WriteLine("SendGridUser: '{0}'", configuration.GetValue<string>("SendGridUser"));
            // Console.WriteLine("SendGridKey: '{0}'", configuration.GetValue<string>("SendGridKey"));
        }

        public IConfiguration Configuration { get; }
        public IHostEnvironment Environment { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(
                    Configuration.GetConnectionString("DefaultConnection")));

            // services.Configure<ApplicationDbContext>(o =>
            // {
            //     // Make sure the identity database is created
            //     o.Database.Migrate();
            // });

            services.AddDefaultIdentity<ApplicationUser>(options => {
                options.SignIn.RequireConfirmedAccount = false;
                // For accepting greek characters
                options.Password.RequireUppercase = false;
                options.Password.RequireLowercase = false;
                options.Password.RequiredLength = 8;
            })
                .AddRoles<IdentityRole>()
                .AddEntityFrameworkStores<ApplicationDbContext>();

            services.AddIdentityServer()
                .GetCertFromServer()
                .AddApiAuthorization<ApplicationUser, ApplicationDbContext>();

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = IdentityConstants.ApplicationScheme;
                options.DefaultChallengeScheme = IdentityConstants.ApplicationScheme;
                options.DefaultSignInScheme = IdentityConstants.ExternalScheme;
            })
                .AddIdentityServerJwt();

            services.AddCors(options =>
            {
                options.AddDefaultPolicy(
                    builder =>
                    {
                        builder.WithOrigins("http://localhost:5000",
                                            "https://localhost:5001",
                                            "https://certhb2b.ddns.net");
                    });
            });

            services.AddTransient<IEmailSender, EmailSender>();
            services.AddTransient<IAppEmailSender, AppEmailSender>();
            services.Configure<AuthMessageSenderOptions>(Configuration);

            services.AddTransient<IProfileService, ProfileService>();
            services.AddTransient<IRazorViewToStringRenderer, RazorViewToStringRenderer>();
            
            services.AddControllersWithViews();
            services.AddRazorPages()
                .AddRazorOptions(options => {
                    options.ViewLocationFormats.Add("/Pages/Templates/Shared/{0}.cshtml");
                    options.ViewLocationFormats.Add("/Pages/Templates/Email/Shared/{0}.cshtml");
                    options.PageViewLocationFormats.Add("/Pages/Templates/{0}.cshtml");
                });

            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration => {
                configuration.RootPath = "ClientApp/build";
            });

            services.AddAntiforgery(o => {
                o.Cookie.Name = "X-CSRF-TOKEN";
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, 
                              IWebHostEnvironment env,
                              IAntiforgery antiforgery,
                              IHostApplicationLifetime appLifetime,
                              UserManager<ApplicationUser> userManager, 
                              RoleManager<IdentityRole> roleManager)
        {
            if (HandleInitialSeeds(app, appLifetime, userManager, roleManager))
            {
                return;
            }

            if (HandleTestingCommands(app, appLifetime))
            {
                return;
            }

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseDatabaseErrorPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            // app.UseCors(config => config.WithOrigins("https://localhost:5001").AllowAnyHeader().AllowAnyMethod());

            app.UseCors();

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.UseRouting();

            app.UseAuthentication();
            app.UseIdentityServer();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");
                endpoints.MapRazorPages();
            });

            app.Use(next => context =>
            {
                // if (context.Request.Path == "/")
                // {
                    //var tokens = antiforgery.GetTokens(context);
                    var tokens = antiforgery.GetAndStoreTokens(context);
                    // context.Response.Cookies.Append("X-CSRF-TOKEN", tokens.CookieToken, new CookieOptions { HttpOnly = false });
                    context.Response.Cookies.Append("CSRF-TOKEN", tokens.RequestToken, 
                        new CookieOptions { HttpOnly = false, SameSite = SameSiteMode.Lax });
                // }
                return next(context);
            });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseReactDevelopmentServer(npmScript: "start");
                }
            });
        }

        private bool HandleInitialSeeds(
            IApplicationBuilder app,
            IHostApplicationLifetime appLifetime,
            UserManager<ApplicationUser> userManager, 
            RoleManager<IdentityRole> roleManager)
        {
            int seedUsersWithProfiles = Configuration.GetValue<int>("SeedUsersWithProfiles");

            if (seedUsersWithProfiles > 0)
            {
                using (var serviceScope = app.ApplicationServices.CreateScope())
                {
                    var services = serviceScope.ServiceProvider;
                    var context = services.GetService<ApplicationDbContext>();
                    var seeder = new SeedUsersWithProfiles(context, userManager, roleManager);

                    seeder.Seed(seedUsersWithProfiles).Wait();
                }

                Console.WriteLine("Task complete. Exiting application.");
                appLifetime.StopApplication();
                return true;
            }

            var migrate = Configuration.GetValue<string>("Migrate");

            if (!String.IsNullOrEmpty(migrate) && migrate.Equals("all", StringComparison.CurrentCultureIgnoreCase))
            {
                Console.WriteLine("Applying database migrations.");

                using (var serviceScope = app.ApplicationServices.CreateScope())
                {
                    var services = serviceScope.ServiceProvider;
                    var context = services.GetService<ApplicationDbContext>();

                    context.Database.MigrateAsync().Wait();
                }

                Console.WriteLine("Migrations complete. Exiting application.");
                appLifetime.StopApplication();
                return true;
            }

            return false;
        }

        private bool HandleTestingCommands(
            IApplicationBuilder app,
            IHostApplicationLifetime appLifetime)
        {
            var sendTestEmailTo = Configuration.GetValue<string>("SendTestMail");

            if (!String.IsNullOrWhiteSpace(sendTestEmailTo))
            {
                Console.WriteLine("Sending test email to '{0}'.", sendTestEmailTo);

                using (var serviceScope = app.ApplicationServices.CreateScope())
                {
                    var services = serviceScope.ServiceProvider;
                    // var appEmailSender = services.GetService<AppEmailSender>();

                    var options = Options.Create<AuthMessageSenderOptions>(Configuration.Get<AuthMessageSenderOptions>()); // Configuration.Get<IOptions<AuthMessageSenderOptions>>();
                    var appEmailSend = new AppEmailSender(options);

                    var opts = options.Value;
                    

                    Console.WriteLine("SendGridUser: '{0}'", opts.SendGridUser);
                    Console.WriteLine("SendGridKey: '{0}'", opts.SendGridKey);
                    Console.WriteLine("EmailSendFrom: '{0}'", opts.EmailSendFrom);
                    Console.WriteLine("EmailSendAs: '{0}'", opts.EmailSendAs);

                    string htmlBody = @"<h2>Sednind this try information from B2B platform<h2>";
                    string textBody = @"Sednind this try information from B2B platform";

                    var sendMailTask = appEmailSend.SendEmailAsync(sendTestEmailTo, Constants.WithAppTitle("Trying sending from B2B"), htmlBody, textBody);

                    sendMailTask.Wait();

                    Console.WriteLine("SendMail response: ({0}), {1}", sendMailTask.Result.StatusCode, sendMailTask.Result.Body.ReadAsStringAsync().Result);
                }

                Console.WriteLine("Email has been sent.");
                appLifetime.StopApplication();
                return true;
            }

            return false;
        }
    }
}
