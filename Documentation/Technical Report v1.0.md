<div class="intro">
  <div class="banner">
    <h2>IDEA P.C. NEKYA</h2>
    <h3 class="project">Ce.R.T.H. B2B</h3>
    <h3 class="author">Christos Lytras</h3>
    <div class="contact">
      ✉️ <a href="mailto:christos.lytras@gmail.com">christos.lytras@gmail.com</a><br>
      ✉️ <a href="mailto:chris@nekya.com">chris@nekya.com</a><br>
      📞 <a href="tel:+306980372501">+30 698 037 2 501</a>
    </div>
  </div>
</div>

<div class="page-break"/>

::: toc

<h2>Table of Contents</h2>

1. [Specifications](#specifications)
   1. [Technologies & Frameworks](#specifications-technologies--frameworks)
   1. [Requirements](#specifications-requirements)
   1. [Compatibility](#specifications-compatibility)
   1. [Database Business Profiles Model Diagram](#specifications-db--business--model--diagram)
1. [Installation](#installation)
   1. [Production](#installation-production)
      1. [ASP.NET Core Runtimes](#installation-production-aspnet--core--runtimes)
      1. [Git Bash & Github](#installation-production-git--bash--github)
      1. [Application Repository Initialization](#installation-production-application--repository--initialization)
      1. [IIS Site Creation](#installation-production-iis--site--creation)
      1. [SQL Server Database](#installation-production-sql--server--database)
      1. [Identity Server Certificate](#installation-production-identity--server--certificate)
   1. [Development](#installation-development)
      1. [User Secrets](#installation-development-usersecrets)

:::

<div class="page-break"/>
<div class="reset-lvl-counters"/>

## Specifications

<a id="specifications-technologies--frameworks"></a>
### Technologies & Frameworks

This application is built with:

- [ASP.NET Core][1] and [C#][2] for cross-platform server-side code
- [Entity Framework Core][5] for ORM with the database
- [Identity Server][6] for Authentication and Authorization
- [React][3] for client-side code
- [Bootstrap][4] for layout and styling

<a id="specifications-requirements"></a>
### Requirements

1. Database server like SQL Server or MySQL Server
1. SSL certificate and permanent HTTPS redirection  
   ::: alert warning
     The application and the [Identity Server][11] **cannot** operate with an invalid/expired or without a SSL certificate.

     There should be a scheduled SSL certificate renewal process, or an auto-scripted renewal.
   :::
1. An environment that has [ASP.NET Core][1] runtimes  
   ::: alert info
     Windows Server with an IIS web server are recommended but not limited to.
   :::
1. [Git Bash][7] for quick and automated update procedure

<a id="specifications-compatibility"></a>
### Compatibility

The application is compatible with the following minimum major browser versions

- Chrome 51
- Firefox 54
- Safari 10
- Edge 14
- Edge Chromium 80
- Internet Explorer 11 (*partially*)

Internet Explorer has major flows and standard CSS supporting issues. It also needs polypills to support ES6 standard features. For old browsers, there will be a warning message and if the application detects browsers that cannot be run into, there will be a notice to let final users know that their browser is old, insecure and propose upgrading to the latest secure versions.

<div class="page-break"/>

<a id="specifications-db--business--model--diagram"></a>
### Database Business Profiles Model Diagram

::: uml-diagram
:[Business Profiles Model Diagram](./Business Profiles Model Diagram.md)
:::

<div class="page-break"/>

## Installation

<a id="installation-production"></a>
### Production

<a id="installation-production-aspnet--core--runtimes"></a>
#### ASP.NET Core Runtimes

- Download & install [ASP.NET Core Runtime 3.1][8]
  ::: alert info
    On Windows, it is recommended installing the **Hosting Bundle**, which includes the .NET Core Runtime and IIS support.
  :::
  ::: alert warning
    IIS Server **must be running** when the ASP.NET Core Hosting Bundle is installed.

    Restart IIS after the Hosting Bundle installation is finished.
  :::

<a id="installation-production-git--bash--github"></a>
#### Git Bash & Github

1. Download & install [Git bash][7]
   Follow the instructions under [Auto-launching ssh-agent on Git for Windows][9] to auto start the SSH agent every time Git bash is starting.
1. Install Github SSH keys for the deployment repository `CERTHB2BPublish`
   1. Copy SSH key files that will be provided (`certhb2bpublish_deploy` and `certhb2bpublish_deploy.pub`) into `~/.ssh` directory. If the `~/.ssh` directory does not exist create it.
   1. Create a `~/.ssh/config` file with the following contents
   ```bash
   Host github.com
   User git
   Hostname github.com
   IdentityFile ~/.ssh/certhb2bpublish_deploy
   ```

<a id="installation-production-application--repository--initialization"></a>
#### Application Repository Initialization

- Open Git bash and clone the `CERTHB2BPublish` repository to `C:\inetpub\CERTHB2B` using the following commands
  ```bash
  cd /c/initpub
  git clone git@github.com:nekdev/CERTHB2BPublish.git CERTHB2B
  ```

<div class="page-break"/>

<a id="installation-production-iis--site--creation"></a>
#### IIS Site Creation

- Add a new IIS Application Pool and name it `CERTHB2B` with latest *.NET CLR version* and *Managed pipeline mode* set to `Integrated`
- Create an IIS site with name `CERTHB2B`, application pool the pool you created at the previous step, physical path `C:\inetpub\CERTHB2B` and binding for both HTTP (*port 80*) and HTTPS (*port 443*) ports

<a id="installation-production-sql--server--database"></a>
#### SQL Server database

1. Open [SQL Server Management Studio][10] (*install it if it's not already installed*) and create a database with name `CERTHB2B`
1. Create SQL Server login and apply it to the database
Expand *Security* ➜ *Logins* (*not on the database, but under server*), right-click to *Logins* and click on *New Login...*. For `Login name` set `IIS APPPOOL\CERTHB2B` and under *User Mapping* page, check the newly created database and  down at *Database role membership* check `public`, `db_datareader` and `db_datawriter`:<br>
   ::: page-break
   ![SSMS Add Login][Asset-SSMSAddLogin]
   :::
   ::: alert warning
   The login name `CERTHB2B` in `IIS APPPOOL\CERTHB2B` **must be the same** as the IIS site name we created in the previous step.
   :::
1. Initial Migrations
   Open Windows PowerShell (*as Administrator*), go to the application directory and run the application DLL with the `--Migrate all` CLI argument to apply initial migrations:
   ```powershell
   Set-Location -Path C:\inetpub\CERTHB2B\
   dotnet CERTHB2B.dll --Migrate all
   ```

<a id="installation-production-identity--server--certificate"></a>
#### Identity Server Certificate

Use [Microsoft Management Console][12] (*MMC*) to import the Identity Server Certificate that will be provided.
1. Follow the instructions under [View certificates with the MMC snap-in][13]
1. Select **Run** from the **Start** menu, and then enter `certlm.msc`
1. Navigate to *Personal* ➜ *Certificates* pane, right click within the *Certificates* panel and click *All Tasks* ➜ *Import...* to start the Certificate Import Wizard
1. Follow the Wizard and select the `PFX` certificate file that will be provided
1. Enter or copy/paste the certificate password provided when asked and **make sure to check** *Mark this key as exportable. This will allow you to back up or transport your keys at a later time.*
1. When asked for *Certificate Store*, select *Place all certificates in the following store* with store name set to `Personal`
1. Click *Next* and *Finish* and you should get a successful message indicating the certificate is now imported. You can check the certificate under *Personal* ➜ *Certificates* with the `CN` subject set to `CERTHB2BIdentityServerSPA`
1. Right click to the certificate *All Tasks* ➜ *Manage Private Keys...* and add *IIS_IUSRS* with *Full control* and *Read* permissions

<div class="page-break"/>

<a id="installation-development"></a>
### Development

<a id="installation-development-usersecrets"></a>
#### User Secrets
 
1. Init user secrets under the project directory
`dotnet user-secrets init`

1. Add items to user secrets
`dotnet user-secrets set SendGridUser <user>`
`dotnet u1er-secrets set SendGridKey  <key>`

1. List items in users secrets
`dotnet user-secrets list`



[1]: https://get.asp.net/
[2]: https://msdn.microsoft.com/en-us/library/67ef8sbd.aspx
[3]: https://facebook.github.io/react/
[4]: http://getbootstrap.com/
[5]: https://docs.microsoft.com/en-us/ef/
[6]: https://identityserver4.readthedocs.io/en/latest/
[7]: https://git-scm.com/
[8]: https://dotnet.microsoft.com/download/dotnet-core/3.1
[9]: https://help.github.com/en/github/authenticating-to-github/working-with-ssh-key-passphrases#platform-windows
[10]: https://docs.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms
[11]: https://identityserver.github.io/Documentation/docsv2/configuration/crypto.html
[12]: https://support.microsoft.com/en-au/help/962457/what-is-mmc
[13]: https://docs.microsoft.com/en-us/dotnet/framework/wcf/feature-details/how-to-view-certificates-with-the-mmc-snap-in

[Asset-SSMSAddLogin]: :[SSMSAddLogin](assets/SSMS_AddLogin.b64)
