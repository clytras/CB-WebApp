@startuml

title
<u>Business Profiles Model Diagram</u>

end title

' hide the spot
' hide circle

' avoid problems with angled crows feet
skinparam linetype ortho

entity "BusinessProfileActivities  " as bpa {
  * ProfileId : <<FK>>
  * ActivityId : <<FK>>
}

entity "BusinessProfiles" as bp #CCFDCC {
  * ProfileId : <<PK>>
  * UserId : <<FK>>
  --
  IsProfileVissible : Boolean
  CompanyName : Text
  Email : Text
  Telephone : Text (10-15)
}

entity "BusinessContact  " as bc {
  * ContactId : <<PK>>
  * ProfileId : <<FK>>
  --
  Name : Text
  Email : Text
  Telephone : Text (10-15)
}

entity "BusinessAddress  " as ba {
  * AddressId : <<PK>>
  * ProfileId : <<FK>>
  --
  StreetAddress : Text
  AddressLine2 : Text
  City : Text
  Region : Text
  PostalCode : Text
  Country : ISO 3166-1 alpha-3
}

entity "BusinessProfileOtherActivities  " as bpoa {
  * OtherActivityId : <<PK>>
  * ProfileId : <<FK>>
  --
  ActivityAlias : Text
  OtherText : Text
}

entity "BusinessActivitiesOptions  " as bao {
  * ActivityId : <<PK>>
  --
  ActivityOptionAlias : Text
}

entity "AspNetUsers  " as anu #F0FFFF {
  * Id : <<PK>>
  --
  UserName : Text
  ...
}

bpa }o.|| bao
bpa }o..|| bp
bc ||.|| bp
bp ||.o{ bpoa
bp ||..|| ba
bp |o..|| anu

@enduml
