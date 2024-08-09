# Carbon Track

## Explanation:
1. **Ownership**: Added owner state variable to store the owner's address. onlyOwner modifier ensures that certain functions can only be called by the owner.
__transferOwnership__ function allows the owner to transfer ownership to a new address.

2. **Struct** 
- __MonthlyCarbonData Struct__: This struct holds the carbon capture data for a specific month.
- __Industry Struct__: The Industry struct now includes a mapping from month (1-12) to MonthlyCarbonData.

3. **Mapping**: A mapping from an address to the Industry struct to store the details of each industry by their address.

4. **Events**: CarbonCaptured event to log when an industry captures carbon.

5. **Modifiers**: industryExists modifier to ensure that actions like capturing carbon are only done by registered industries.

6. **Functions**
- __captureCarbon__ : Captures carbon for a specified month and updates the monthly data.
- __registerIndustry__: Allows an industry to register by providing its name.
- __captureCarbon__: Allows registered industries to record the amount of carbon they have captured.
- __getCarbonCaptured__: Returns the total amount of carbon captured by a specific industry.
- __getIndustryDetails__: Function returns the industry ID and name for a given industry address.


### Deployment

You can check example deploy in lisk sepolia testnet [0x76617AD17079b8228528b54f991aB821a4fF161d](
https://sepolia-blockscout.lisk.com/address/0x76617AD17079b8228528b54f991aB821a4fF161d).


### Test

Test suite and provide feedback on whether the tests passed or failed.

```shell
npx hardhat test

CarbonCaptureContract
    Ownership
      ✔ should set the right owner
      ✔ should transfer ownership
      ✔ should not allow non-owner to transfer ownership
    Register
      ✔ should register a new industry
      ✔ should not register an already registered industry
      ✔ Should not allow non-owners to register an industry
      ✔ Should get industry details by ID
    Capture
      ✔ Should allow an industry to capture carbon
      ✔ Should allow to get the total carbon captured by an industry
      ✔ should not capture carbon for an invalid industry ID
      ✔ Should allow the owner to verify the carbon captured
```