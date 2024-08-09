import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const CarbonCaptureModule = buildModule("CarbonCaptureModule", (m) => {
  const carbonCapture = m.contract("CarbonCapture");

  return { carbonCapture };
});

export default CarbonCaptureModule;