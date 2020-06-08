

using System;
using System.Collections.Generic;
using System.Linq;

namespace CERTHB2B.Utils
{
    public class CollectionToDictionary<T> : Dictionary<string, object>
    {
        private List<T> list;
        private List<ICollection<T>> listCollection;

        public CollectionToDictionary(List<ICollection<T>> listCollection)
        {
            this.listCollection = listCollection;
        }

        public CollectionToDictionary(List<T> list)
        {
            this.list = list;
        }

        public Dictionary<string, object> Convert(Func<T, string> key, Func<T, string> value)
        {
            var result = new Dictionary<string, object>();

            if (listCollection != null)
            {
                listCollection.ToList().ForEach(item => item.ToList().ForEach(i => result.Add(key(i), value(i))));
            }
            else
            {
                list.ForEach(item => result.Add(key(item), value(item)));
            }

            return result;
        }
    }
}
