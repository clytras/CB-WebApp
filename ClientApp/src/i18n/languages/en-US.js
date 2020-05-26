import Content from './Content.en-US';
import CountriesISOAlpha3 from './Countries.en-US';

export default {

  hello:'Hello!',
  howAreYou:'How Are You?',

  thisLanguage: 'English',
  languageFlagIso: 'us',
  languageEn: 'English',
  languageEl: 'Greek',
  euroSign: '€',

  titles: {
    Information: 'Information',
    CompanyName: 'Company name',
    Email: 'Email',
    Name: 'Name',
    Telephone: 'Telephone',
    EmailAddress: 'Email address',
    TelephoneNumber: 'Telephone number',
    Address: 'Address',
    StreenAddress: 'Street address',
    AdditionalAddressInformation: 'Additional address information',
    City: 'City',
    StateRegionProvince: 'State / Region / Province',
    PostalCode: 'Postal code',
    Country: 'Country',
    OtherText: 'Other',
    RejectionReason: 'Rejection reason',
    SaveProfileInformation: 'Save profile information',
    SaveProfileActivities: 'Save profile activities',
    UseAccountEmailAddress: 'Use account email address',
    ContactPerson: 'Contact person',
    Nav: {
      Sections: {
        edit: 'Edit',
        dashboard: 'Dashboard',
        users: 'Users',
        content: 'Content'
      }
    }
  },
  validation: {
    Fields: {
      EmptyH: 'Empty {field}',
      EmptyS: 'Empty {field}',
      Empty: 'Empty {field}',
      MustNotBeEmpty: 'The field {field} must not be empty',
      IsRequired: 'The field {field} is required',
      MustBeLengthOf: 'The field {field} must be at least {len} characters',
      MustBeAtLeastLengthOf: 'Must be at least {len} characters',
      IsInvalid: 'The field {field} is invalid',
      PasswordNotMatch: 'Passwords do not match',
      NotValidEmail: 'Not a valid email address',
      InvalidTelephone: 'Must contain {min}-{max} numeric digits',
      NotValidPostalCode: 'Not a valid postal code'
    }
  },
  placeholders: {
    ThisFieldIsRequired: 'This field is required',
  },
  messages: {
    Auth: {
      AccountLocked: 'Account is locked',
      Account2FA: 'Account requires two factor authentication',
      LoginFail: 'Check you email and password',
      AccountExists: 'An account with that mail already exists',
      RegistrationError: 'There was an error trying to register your account',
      EmailNotMatchRequest: 'The email address does not match with the action request',
      PasswordChangedSuccessfully: 'Your password changed successfully',
      InvalidEmailAddress: 'Invalid email address',
      InvalidPassword: 'Password must have at least 8 character, contain upper/lower letters and digits',
      ConfirmPasswordNotMatch: 'Confirmation password does not match with the password',
      WeakVulnerablePassword: 'Password is weak or vulnerable',
      ResourceAccessDenied: 'You do not have access to this resource',
      ActionAccessDenied: 'You do not have access to perform this action',
      PasswordResetRequestSent: 'A password reset link has been sent to your email.  \nPlease check your email inbox and follow the reset link to reset your password.',
      PasswordResetSuccess: 'Your password has been reset',
      CouldNotSendPasswordRequest: 'Could not send password request email',
      ActionOnlyForAuth: 'Only logged in accounts can perform this action',
      EmailVerificationSent: 'Email verification sent successfully',
      EmailVerificationNotSent: 'Email verification not sent',
      EmailVerificationSentVisitMail: 'A verification link has now been sent to your email.\nPlease check your email inbox and follow the verification link to verify your email address.',
      CheckCurrentPasswordRetry: 'Check your current password and retry',
      EmailIsVerified: 'Your email address is already verified',
      NoVerifiedEmail: 'Your email address has not been verified.  \nYou need to verify your email address to complete you profile.\n\nPlease check your email inbox and follow the verification link to verify your email address.\n\nVisit your [profile settings](/account/settings) and use the resend email verification action to resend the verification email.',
    },
    Business: {
      BusinessProfileNotComplete: 'Your profile is not complete.  \nPeople cannot discover you unless you complete your profile.\n\nPlease visit your [account profile page](/account/profile) and provide your data to complete your profile.',
      SaveBasicInformationBeforeActivities: 'Save profile information above to select your activities'
    },
    InvalidFieldsDataTryAgain: 'There are some missing fields or fields with wrong information.  \nInput valid data to fix the errors and try again.',
    ProfileInformationSaved: 'Your profile information is now saved.  \nAlso review and update your related activities below.',
    RequestError: 'Request error ({error})',
    ContactSupport: 'Please contact support',
    UnexpectedError: 'There was an unexpected error',
    RequestRejected: 'The request was rejected by the server',
    DeleteEntry: 'Are you sure you want to delete this entry?',
    EntryUpdated: 'Entry updated successfully',
    EntryCreated: 'Entry created successfully',
    EntryDeleted: 'Entry deleted successfully',

    Confirms: {
      QuestionDelete: 'Are you sure you want to delete {for}?',
      for: {
        ContentBlock: 'the content block'
      }
    }
  },
  Business: {
    Lists: {
      TopicsOfInterest: 'Topics of interest',
      CleanPowerTransport: 'Clean power for transport',
      Electromobility: 'Electromobility',
      MicroMobility: 'Micro mobility',
      Biofuels: 'Biofuels',
      HydrogenMobility: 'Hydrogen mobility',
      AirMobility: 'Air mobility ',
      DronesManufacturing: 'Drones manufacturing',
      DronesTrading: 'Drones trading',
      Logistics: 'Logistics',
      LastmileLogistics: 'Last-mile logistics',
      DronesApplicationsForLogistics: 'Drones applications for logistics',
      UrbanMobility: 'Urban mobility',
      SharedMobility: 'Shared mobility',
      TrafficManagementSystems: 'Traffic management systems',
      TransportInfrastructure: 'Transport Infrastructure',
      RailInfrastructure: 'Rail infrastructure',
      RoadInfrastructure: 'Road infrastructure',
      MaritimeInfrastructure: 'Maritime infrastructure',
      AirTransportInfrastructure: 'Air transport infrastructure',
      Automotive: 'Automotive',
      ElectricVehiclesManufacturing: 'Electric vehicles manufacturing',
      ElectricVehiclesTrading: 'Electric vehicles trading',
      AutonomousVehiclesManufacturing: 'Autonomous vehicles manufacturing',
      AutonomousVehiclesTrading: 'Autonomous vehicles trading',
      ICTTransport: 'ICT for transport',
      ITSSystems: 'ITS systems',
      CITSSystems: 'C-ITS systems',
      DataAnalyticsTransport: 'Data analytics for transport',
      TransportPolicy: 'Transport policy',
      ConsultingServices: 'Consulting services ',
      Offer: 'Offer',
      Collaboration: 'Collaboration',
      ForFundingCall: 'For funding call',
      DevelopNewProduct: 'Develop new product',
      DevelopNewService: 'Develop new service',
      TechnicalCooperation: 'Technical cooperation',
      BusinessConsultingServices: 'Business consulting services',
      TransportRelatedConsultingServices: 'Transport related consulting services',
      Request: 'Request',
      Supplier: 'Supplier',
      ForComponents: 'For components',
      ForServices: 'For services',
      ForData: 'For data'
    }
  },
  Collections: {
    Countries: CountriesISOAlpha3
  },
  Content
}
