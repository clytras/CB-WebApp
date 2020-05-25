namespace CERTHB2B.ViewModels
{
  public class ButtonViewModel
  {
    public string Text { get; set; }
    public string Url { get; set; }
    
    public ButtonViewModel(string text, string url)
    {
      Text = text;
      Url = url;
    }
  }
}
