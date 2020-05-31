# Ce.R.T.H. B2B

<div class="intro">
  <div class="banner">
    <h2>IDEA P.C. NEKYA</h2>
    <h3>Christos Lytras</h3>
    <div class="contact">
      ✉️ <a href="mailto:christos.lytras@gmail.com">christos.lytras@gmail.com</a><br>
      ✉️ <a href="mailto:chris@nekya.com">chris@nekya.com</a><br>
      📞 <a href="tel:+306980372501">+30 698 037 2 501</a>
    </div>
  </div>
</div>

<div class="page"/>

## Table of Contents

1. [Specifications](#Specifications)
   1. [Technologies & Frameworks](#Specifications-TechnologiesFramworks)
   1. [Requirements](#Specifications-Requirements)
1. [Installation](#Installation)
   1. [Production](#Installation-Production)
   1. [Development](#Installation-Development)
      1. User Secrets


1. Test
1. This

<div class="alert success">
  <p>Do not do this because success.</p>
</div>

<div class="alert info">
  <p>Do not do this because info.</p>
</div>

<div class="alert warning">
  <p>Do not do this because warning.</p>
</div>

<div class="alert danger">
  <p>Do not do this because danger.</p>
</div>


<div class="page"/>


## Specifications

### Technologies & Frameworks

This application is built with:

- [ASP.NET Core][1] and [C#][2] for cross-platform server-side code
- [Entity Framework Core][5] for ORM with the database
- [Identity Server][6] for Authentication and Authorization
- [React][3] for client-side code
- [Bootstrap][4] for layout and styling

### Requirements

1. Database server like SQL Server or MySQL Server
1. SSL certificate and permanent HTTPS redirection  
   **WARNING** The application `cannot` operate with an invalid/expired or without a SSL certificate.  
   There should be a `scheduled SSL certificate renewal` process, or an auto-scripted renewal.
1. An environment that has [ASP.NET Core][1] runtimes  
   Windows Server with an IIS web server are recommended but not limited to.
1. [Git CLI][7] for quick and automated update procedure

<div class="page"/>

## Installation

### Production

### Development

#### User Secrets

1. Init user secrets under the project directory:<br>
`dotnet user-secrets init`

1. Add items to user secrets:<br>
`dotnet user-secrets list`
`dotnet user-secrets set SendGridUser <user>`
`dotnet u1er-secrets set SendGridKey  <key>`




[1]: https://get.asp.net/
[2]: https://msdn.microsoft.com/en-us/library/67ef8sbd.aspx
[3]: https://facebook.github.io/react/
[4]: http://getbootstrap.com/
[5]: https://docs.microsoft.com/en-us/ef/
[6]: https://identityserver4.readthedocs.io/en/latest/
[7]: https://git-scm.com/
