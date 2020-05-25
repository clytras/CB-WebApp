namespace CERTHB2B.ViewModels.Account
{
  public class ConfirmationCodeViewModel
  {
    public string Uid { get; set; }
    public string Code { get; set; }
    public string ConfirmationUrl { get; set; }
    
    public ConfirmationCodeViewModel(string uid, string code, string confirmationUrl)
    {
      Uid = uid;
      Code = code;
      ConfirmationUrl = confirmationUrl;
    }
  }
}
