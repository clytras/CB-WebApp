# Ce.R.T.H. B2B

::: header
Some header text to preview
:::

## Table of Contents
1. [Specifications](#Specifications)
   1. [Technologies & Framworks](#TechnologiesFramworks)
   1. [Requirements](#Requirements)
1. [Installation](#Installation)
   1. [Production](#Installation-Production)
   1. [Development](#Installation-Development)
      1. User Secrets


<ol class="toc">
 <li>First</li>
 <li>Second
 <ol>
  <li>Sub of Second</li>
  <li>Another Sub</li>
 </ol>
 </li>
 <li>Third</li>
 <li>Fourth </li>
</ol>


<div class="alert warning">
Do not do this because.
</div>

:imp:

<div class="page"/>


## <a id="Specifications"></a>Specifications

### <a id="Specifications-TechnologiesFramworks"></a>Technologies & Frameworks

This application is built with:

```csharp
for (int i = 0 ; i < 10; i++)
{
  // Code to execute.
}
```

- [ASP.NET Core][1] and [C#][2] for cross-platform server-side code
- [Entity Framework Core][5] for ORM with the database
- [Identity Server][6] for Authentication and Authorization
- [React][3] for client-side code
- [Bootstrap][4] for layout and styling

### <a id="Specifications-Requirements"></a>Requirements

1. Database server like SQL Server or MySQL Server
1. SSL certificate and permanent HTTPS redirection  
   **WARNING** The application `cannot` operate with an invalid/expired or without a SSL certificate.  
   There should be a `scheduled SSL certificate renewal` process, or an auto-scripted renewal.
1. An environment that has [ASP.NET Core][1] runtimes  
   Windows Server with an IIS web server are recommended but not limited to.
1. [Git CLI][7] for quick and automated update procedure

<div class="page"/>

## <a id="Installation"></a>Installation

### <a id="Installation-Production"></a>Production

### <a id="Installation-Development"></a>Development

#### <a id="user-secrets"></a>User Secrets

1. Init user secrets under the project directory:<br>
`dotnet user-secrets init`

2. Add items to user secrets:<br>
`dotnet user-secrets list`
`dotnet user-secrets set SendGridUser <user>`
`dotnet user-secrets set SendGridKey  <key>`




[1]: https://get.asp.net/
[2]: https://msdn.microsoft.com/en-us/library/67ef8sbd.aspx
[3]: https://facebook.github.io/react/
[4]: http://getbootstrap.com/
[5]: https://docs.microsoft.com/en-us/ef/
[6]: https://identityserver4.readthedocs.io/en/latest/
[7]: https://git-scm.com/
