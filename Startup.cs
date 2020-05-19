using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.EntityFrameworkCore;
using EKETAGreenmindB2B.Data;
using EKETAGreenmindB2B.Models;
using EKETAGreenmindB2B.Data.Seeds;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using EKETAGreenmindB2B.Services;
using IdentityServer4.Services;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Http;

namespace EKETAGreenmindB2B
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

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

            services.AddDefaultIdentity<ApplicationUser>(options => options.SignIn.RequireConfirmedAccount = false)
                .AddRoles<IdentityRole>()
                .AddEntityFrameworkStores<ApplicationDbContext>();

            // services.AddDefaultIdentity<ApplicationUser>(options => options.SignIn.RequireConfirmedAccount = false)
            //     .AddRoles<IdentityRole>()
            //     .AddEntityFrameworkStores<ApplicationDbContext>();

            // Working
            // services.AddIdentity<ApplicationUser, IdentityRole>()
            //     // services.AddDefaultIdentity<IdentityUser>()
            //     .AddEntityFrameworkStores<ApplicationDbContext>();

            services.AddIdentityServer()
                .AddApiAuthorization<ApplicationUser, ApplicationDbContext>();

            services.AddAuthentication()
                .AddIdentityServerJwt();

            services.AddCors(options =>
            {
                options.AddDefaultPolicy(
                    builder =>
                    {
                        builder.WithOrigins("http://localhost:5000",
                                            "https://localhost:5001");
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
                              UserManager<ApplicationUser> userManager, 
                              RoleManager<IdentityRole> roleManager)
        {
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

            IdentityDataInitializer.SeedData(userManager, roleManager);

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
                    context.Response.Cookies.Append("CSRF-TOKEN", tokens.RequestToken, new CookieOptions { HttpOnly = false });
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
    }
}
