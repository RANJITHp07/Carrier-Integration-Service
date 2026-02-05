export interface Address {
  readonly postalCode: string;
  readonly countryCode: string;
  readonly stateProvince?: string;
  readonly city?: string;
}
