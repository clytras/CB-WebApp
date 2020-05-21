namespace EKETAGreenmindB2B.ViewModels.Account
{
  public class ResetPasswordViewModel
  {
    public string Uid { get; set; }
    public string Code { get; set; }
    public string ResetPasswordUrl { get; set; }
    
    public ResetPasswordViewModel(string uid, string code, string resetPasswordUrl)
    {
      Uid = uid;
      Code = code;
      ResetPasswordUrl = resetPasswordUrl;
    }
  }
}
