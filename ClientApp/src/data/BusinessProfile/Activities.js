/**
 * Dollar sign ($) is for list options collection or for a single option item
 */

export default Object.freeze({
  TopicsOfInterest: {
    CleanPowerTransport: {
      $: [
        'Electromobility',
        'MicroMobility',
        'Biofuels',
        'HydrogenMobility'
      ]
    },
    AirMobility: {
      $: [
        'DronesManufacturing',
        'DronesTrading'
      ]
    },
    Logistics: {
      $: [
        'LastmileLogistics',
        'DronesApplicationsForLogistics'
      ]
    },
    UrbanMobility: {
      $: [
        'SharedMobility',
        'TrafficManagementSystems'
      ]
    },
    TransportInfrastructure: {
      $: [
        'RailInfrastructure',
        'RoadInfrastructure',
        'MaritimeInfrastructure',
        'AirTransportInfrastructure'
      ]
    },
    Automotive: {
      $: [
        'ElectricVehiclesManufacturing',
        'ElectricVehiclesTrading',
        'AutonomousVehiclesManufacturing',
        'AutonomousVehiclesTrading'
      ]
    },
    ICTTransport: {
      $: [
        'ITSSystems',
        'CITSSystems',
        'DataAnalyticsTransport'
      ]
    },
    TransportPolicy: '$',
    ConsultingServices: '$'
  },
  Offer: {
    Collaboration: {
      $: [
        'ForFundingCall',
        'DevelopNewProduct',
        'DevelopNewService'
      ]
    },
    TechnicalCooperation: '$',
    ConsultingServices: {
      $: [
        'BusinessConsultingServices',
        'TransportRelatedConsultingServices',
      ]
    }
  },
  Request: {
    Collaboration: {
      $: [
        'ForFundingCall',
        'DevelopNewProduct',
        'DevelopNewService'
      ]
    },
    Supplier: {
      $: [
        'ForComponents',
        'ForServices',
        'ForData'
      ]
    },
    ConsultingServices: {
      $: [
        'BusinessConsultingServices',
        'TransportRelatedConsultingServices',
      ]
    }
  }
});
