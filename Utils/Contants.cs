using System;

namespace CERTHB2B.Utils
{
    public class Constants
    {
        public const string AppTitle = "IMET B2B";
        public const string IdentityRoleAdminName = "Admin";
        public const string IdentityRoleEditorName = "Editor";
        public const string IdentityRoleUserName = "User";

        public static string WithAppTitle(string append)
        {
            return String.Format("{0} - {1}", Constants.AppTitle, append);
        }
    }
}
