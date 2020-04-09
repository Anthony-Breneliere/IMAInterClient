// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  server: 'http://localhost:5000',
  envName: 'dev',
  admins: [ "lpapillo", "abreneli", "bkervich", "gmace", "alapeyre", "rbillaul", "elhereec" ],
  applicationServerPublicKey:'BPx2_IoQGYIdeTn10pGi8FIRAfsa5Z0teNhy552i7-jg0kaFpvZJDmlbUUGBuSAcFIBMfaP8Nxl50vF5RCTa4hk'  
  //applicationServerPublicKey:'BPGoR8IWVkUwzgYs1oy0D-K-_S2_IdPSDAB1qt0Nj29MhbW8ZCV4UQsQKBGWgXpSzkljofdt2I8SdpiORbW-LY4'
};
