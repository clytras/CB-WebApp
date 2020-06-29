using System;

public class ConsoleLoader
  {
    private string text;
    private int currentLoaderLength;
    private char loaderChar;
    private int maxLoaderChars;
    private DateTime lastUpdate;
    private long updateInterval;
    private int cursorLeft;
    private int cursorTop;
    public ConsoleLoader(string text, char loaderChar = '.', long updateInterval = 1000, int maxLoaderChars = 3)
    {
      Reset(text, loaderChar, updateInterval, maxLoaderChars);
    }

    public void Reset(string text, char loaderChar = '.', long updateInterval = 1000, int maxLoaderChars = 3)
    {
      this.text = text;
      this.loaderChar = loaderChar;
      this.updateInterval = updateInterval;
      this.currentLoaderLength = 0;
      this.maxLoaderChars = maxLoaderChars;
      this.lastUpdate = DateTime.Now;
      Console.Write(text);
      this.cursorLeft = Console.CursorLeft;
      this.cursorTop = Console.CursorTop;
      Console.CursorVisible = false;
    }

    public void Tick()
    {
      if (DateTime.Now - lastUpdate >= TimeSpan.FromMilliseconds(updateInterval))
      {
        if (++currentLoaderLength > maxLoaderChars) currentLoaderLength = 0;

        Console.SetCursorPosition(cursorLeft, cursorTop);
        Console.Write(new String(loaderChar, currentLoaderLength).PadRight(maxLoaderChars));
        lastUpdate = DateTime.Now;
      }
    }

    public void End(string finishText = "", bool writeNewLine = true)
    {
      Console.SetCursorPosition(cursorLeft, cursorTop);
      Console.Write(new String(loaderChar, maxLoaderChars));
      Console.Write(finishText);

      if (writeNewLine) Console.WriteLine();
      Console.CursorVisible = true;
    }
  }
