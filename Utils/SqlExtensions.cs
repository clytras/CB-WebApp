using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using Microsoft.EntityFrameworkCore.Query;
using Microsoft.EntityFrameworkCore.Query.SqlExpressions;
/// <summary>
/// SQL Extension methods to get the SQL and check correctness
/// Class can be removed with EF Core 5 (https://github.com/dotnet/efcore/issues/6482#issuecomment-587605366) (although maybe variable substitution might still be necessary if we want them inline)
/// </summary>
public static class SqlExtensions
{

    private static object Private(this object obj, string privateField) => obj?.GetType().GetField(privateField, BindingFlags.Instance | BindingFlags.NonPublic)?.GetValue(obj);
    private static T Private<T>(this object obj, string privateField) => (T)obj?.GetType().GetField(privateField, BindingFlags.Instance | BindingFlags.NonPublic)?.GetValue(obj);

    /// <summary>
    /// Gets a SQL statement from an IQueryable
    /// </summary>
    /// <param name="query">The query to get the SQL statement for</param>
    /// <returns>Formatted SQL statement as a string</returns>
    public static string ToQueryString<TEntity>(this IQueryable<TEntity> query) where TEntity : class
    {
        using var enumerator = query.Provider.Execute<IEnumerable<TEntity>>(query.Expression).GetEnumerator();
        var relationalCommandCache = enumerator.Private("_relationalCommandCache");
        var selectExpression = relationalCommandCache.Private<SelectExpression>("_selectExpression");
        var factory = relationalCommandCache.Private<IQuerySqlGeneratorFactory>("_querySqlGeneratorFactory");
        var relationalQueryContext = enumerator.Private<RelationalQueryContext>("_relationalQueryContext");

        var sqlGenerator = factory.Create();
        var command = sqlGenerator.GetCommand(selectExpression);
        var parametersDict = relationalQueryContext.ParameterValues;

        return SubstituteVariables(command.CommandText, parametersDict);
    }

    public static string ToSql<TEntity>(this IQueryable<TEntity> query) where TEntity : class
    {
        var enumerator = query.Provider.Execute<IEnumerable<TEntity>>(query.Expression).GetEnumerator();
        var relationalCommandCache = enumerator.Private("_relationalCommandCache");
        var selectExpression = relationalCommandCache.Private<SelectExpression>("_selectExpression");
        var factory = relationalCommandCache.Private<IQuerySqlGeneratorFactory>("_querySqlGeneratorFactory");

        var sqlGenerator = factory.Create();
        var command = sqlGenerator.GetCommand(selectExpression);

        string sql = command.CommandText;
        return sql;
    }

    private static string SubstituteVariables(string commandText, IReadOnlyDictionary<string, object> parametersDictionary)
    {
        var sql = commandText;
        foreach (var (key, value) in parametersDictionary)
        {
            var placeHolder = "@" + key;
            var actualValue = GetActualValue(value);
            sql = sql.Replace(placeHolder, actualValue);
        }

        return sql;
    }

    private static string GetActualValue(object value)
    {
        var type = value.GetType();

        if (type.IsNumeric())
            return value.ToString();

        if (type == typeof(DateTime) || type == typeof(DateTimeOffset))
        {
            switch (type.Name)
            {
                case nameof(DateTime):
                    return $"'{(DateTime)value:u}'";

                case nameof(DateTimeOffset):
                    return $"'{(DateTimeOffset)value:u}'";
            }
        }

        return $"'{value}'";
    }

    private static bool IsNullable(this Type type)
    {
        return
            type != null &&
            type.IsGenericType &&
            type.GetGenericTypeDefinition() == typeof(Nullable<>);
    }

    private static bool IsNumeric(this Type type)
    {
        if (IsNullable(type))
            type = Nullable.GetUnderlyingType(type);

        if (type == null || type.IsEnum)
            return false;

        return Type.GetTypeCode(type) switch
        {
            TypeCode.Byte => true,
            TypeCode.Decimal => true,
            TypeCode.Double => true,
            TypeCode.Int16 => true,
            TypeCode.Int32 => true,
            TypeCode.Int64 => true,
            TypeCode.SByte => true,
            TypeCode.Single => true,
            TypeCode.UInt16 => true,
            TypeCode.UInt32 => true,
            TypeCode.UInt64 => true,
            _ => false
        };
    }
}
