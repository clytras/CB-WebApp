using System.IO;
using System.Runtime.Serialization.Json;
using System.Text;

namespace CERTHB2B.Utils
{
    public class DataConverters
    {
        public static string DataToJson<T>(T data)
        {
            using(MemoryStream stream = new MemoryStream())
            {
                DataContractJsonSerializer serialiser = new DataContractJsonSerializer(
                    data.GetType(),
                    new DataContractJsonSerializerSettings()
                    {
                        UseSimpleDictionaryFormat = true
                    });

                serialiser.WriteObject(stream, data);
                return Encoding.UTF8.GetString(stream.ToArray());
            }
        }
    }
}
