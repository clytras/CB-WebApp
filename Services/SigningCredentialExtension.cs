using System;
using Microsoft.AspNetCore.Identity;
using EKETAGreenmindB2B.Models;
using IdentityServer4.Services;
using System.Threading.Tasks;
using IdentityServer4.Models;
using System.Collections.Generic;
using System.Security.Claims;
using IdentityModel;
using Microsoft.Extensions.DependencyInjection;
using System.Security.Cryptography.X509Certificates;

namespace EKETAGreenmindB2B.Services
{
    public static class SigningCredentialExtension
    {
        public static IIdentityServerBuilder GetCertFromServer(this IIdentityServerBuilder builder)
        {
            // Note:  in order for the certificate to be visible to the app, 
            // an application setting "WEBSITE_LOAD_CERTIFICATES" with the value 
            // of your SSL cert's thumbprint must be added to your IdentityServer
            // webapp on Azure.
            // var thumbprint = "E987C1D28069595B49BD502666415C7E3AC939FC";
            var subjectName = "CERTHB2BIdentityServerSPA";
            var store = new X509Store(StoreName.My, StoreLocation.LocalMachine);

            store.Open(OpenFlags.ReadOnly);

            var certs = store.Certificates.Find(X509FindType.FindBySubjectName, subjectName, false);

            if (certs.Count > 0)
            {
                var psign = System.Convert.FromBase64String("MURFbnQhVHkqcnQyTzJPKg==");
                var pprint = System.Text.Encoding.UTF8.GetString(psign);

                X509Certificate2 cert = new X509Certificate2(
                    certs[0].Export(X509ContentType.Pfx, pprint), pprint, X509KeyStorageFlags.MachineKeySet);
                builder.AddSigningCredential(cert);
                builder.AddValidationKey(cert);
            }
            else
            {
                Console.WriteLine("No Identity cert found");
            }
            return builder;
        }

        //  public static IIdentityServerBuilder GetCertFromEmbeddedProjectFile(
        //                IIdentityServerBuilder builder)
        //  {
        //       var assembly = Assembly.GetExecutingAssembly();
        //       var fileName = "Your.Project.Namespace.FileName.fileExtension";
        //       using (Stream stream = assembly.GetManifestResourceStream(resourceName))
        //       {
        //             Byte[] raw = new Byte[stream.Length];

        //             for (Int32 i = 0; i < stream.Length; i++)
        //             {
        //                 raw[i] = (Byte)stream.ReadByte();
        //             }
        //             X509Certificate2 cert = new X509Certificate2(raw, password);
        //             builder.AddSigningCredential(cert);
        //             builder.AddValidationKey(cert);
        //        }
        //        return builder;
        //  }
    }
}
