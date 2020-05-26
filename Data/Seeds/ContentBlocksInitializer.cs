using System;
using System.Linq;
using System.Collections.Generic;
using CERTHB2B.Models;
using CERTHB2B.Utils;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Migrations;

namespace CERTHB2B.Data.Seeds
{
    public partial class ContentBlocksInitializer
    {
        public static void SeedContentBlocks(EntityTypeBuilder blocks)
        {
            var contentBlocks = new List<dynamic>
            {
                new {
                    BindToContent = "Welcome",
                    Content = @"## Dear visitor,

Aiming to support you in:
- Managing your business's identity
- Building and expanding your business network and 
- Growing your business activities 

We created this contact point to bring all of your potential partners together.",
                    Locked = true
                },
                new {
                    BindToContent = "RegisterSuccess",
                    Content = @"## You account has been created.

You should go to your registration email inbox and check for the account confirmation email.
Use the account confirmation link to confirm your email address.

Don't forget to look inside the spam folder as well for the confirmation email.

You can now [login](/account/login) to your account.
",
                    Locked = true
                },
                new {
                    BindToContent = "Contact",
                    Content = @"## For technical support please contact: 

**Maria Stefanidou**  
Research Associate  
eMail: [mstefanidou@certh.gr][1]  
Tel.: [+30 2311 257622][2]

**Sofoklis Dais**  
Research Associate  
eMail: [dais@certh.gr][3]  
Tel.: [+30 2311 257622][4]

[1]: mailto:mstefanidou@certh.gr
[2]: tel:+302311257622
[3]: mailto:dais@certh.gr
[4]: tel:+302311257622",
                    Locked = true
                },
            };

            blocks.HasData(contentBlocks.Select((b, i) => new ContentBlock
            {
                BlockId = i + 1,
                BindToContent = b.BindToContent,
                Content = b.Content,
                Locked = b.Locked
            }));
        }
    }
}
