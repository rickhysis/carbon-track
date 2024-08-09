import { expect } from "chai";
//import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ignition, viem } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import CarbonCaptureModule from "../ignition/modules/CarbonCapture";

describe("CarbonCaptureContract", function () {
    async function deployContributeFixture() {
        const [owner, addr1, addr2, addr3] = await viem.getWalletClients()

        const { carbonCapture } = await ignition.deploy(CarbonCaptureModule, {
            defaultSender: owner.account.address
        });

        return { carbonCapture, owner, addr1, addr2, addr3 }
    }

    describe("Ownership", function () {
        it("should set the right owner", async function () {
            const { carbonCapture, owner } = await loadFixture(deployContributeFixture);

            expect((await carbonCapture.read.owner()).toLowerCase()).to.equal(owner.account.address);
        });

        it("should transfer ownership", async function () {
            const { carbonCapture, owner, addr1 } = await loadFixture(deployContributeFixture);

            await carbonCapture.write.transferOwnership([addr1.account.address], {
                account: owner.account
            });

            expect((await carbonCapture.read.owner()).toLowerCase()).to.equal(addr1.account.address);
        });

        it("should not allow non-owner to transfer ownership", async function () {
            const { carbonCapture, addr1 } = await loadFixture(deployContributeFixture);

            expect(carbonCapture.write.transferOwnership([addr1.account.address], {
                account: addr1.account
            })).to.be.revertedWith("Caller is not the owner");
        });

    })

    describe("Register", function () {
        it("should register a new industry", async function () {
            const { carbonCapture, owner, addr1 } = await loadFixture(deployContributeFixture);

            const hash = await carbonCapture.write.registerIndustry([addr1.account.address, "IndustryA", BigInt(1), "52.5200N", "13.4050E"], {
                account: owner.account
            });
            const logs = await carbonCapture.getEvents.IndustryRegistered()
            const [id, name, city, latitude, longitude] = await carbonCapture.read.getIndustryDetails([addr1.account.address]);

            expect(id).to.equal(1); // Industry ID
            expect(name).to.equal("IndustryA"); // Industry Name
            expect(city).to.equal(1); // city
            expect(latitude).to.equal("52.5200N"); // latitude
            expect(longitude).to.equal("13.4050E"); // longitude

            expect(hash).to.be.a('string')
            expect(logs[0].eventName).equal('IndustryRegistered')
        });


        it("Should get industry details by ID", async function () {
            const { carbonCapture, owner, addr1 } = await loadFixture(deployContributeFixture);

            await carbonCapture.write.registerIndustry([addr1.account.address, "IndustryA", BigInt(2), "52.5200N", "13.4050E"], {
                account: owner.account
            });

            const [industryAddress, name, city] = await carbonCapture.read.getIndustryById([BigInt(1)]);

            expect(industryAddress.toLowerCase()).to.equal(addr1.account.address);
            expect(name).to.equal("IndustryA");
            expect(city).to.equal(2);
        });

        it("should not register an already registered industry", async function () {
            const { carbonCapture, owner, addr1 } = await loadFixture(deployContributeFixture);

            await carbonCapture.write.registerIndustry([addr1.account.address, "IndustryA", BigInt(1), "52.5200N", "13.4050E"], {
                account: owner.account
            });
            expect(carbonCapture.write.registerIndustry([addr1.account.address, "IndustryA", BigInt(1), "52.5200N", "13.4050E"], {
                account: owner.account
            })).to.be.revertedWith("industry already registered.");
        });

        it("Should not allow non-owners to register an industry", async function () {
            const { carbonCapture, addr1 } = await loadFixture(deployContributeFixture);

            expect(
                carbonCapture.write.registerIndustry([addr1.account.address, "IndustryA", BigInt(1), "52.5200N", "13.4050E"], {
                    account: addr1.account
                })
            ).to.be.revertedWith("Caller is not the owner");
        });

    })


    describe("Capture", function () {
        it("should return industries by limit and offset", async function () {
            // Retrieve industries by limit and start index
            const start = BigInt(1);
            const limit = BigInt(2);

            const { carbonCapture, owner, addr1, addr2 } = await loadFixture(deployContributeFixture);

            await carbonCapture.write.registerIndustry([addr1.account.address, "IndustryA", BigInt(2), "52.5200N", "13.4050E"], {
                account: owner.account
            });

            await carbonCapture.write.registerIndustry([addr2.account.address, "IndustryB", BigInt(12), "6.5200N", "7.4050E"], {
                account: owner.account
            });

            const result = await carbonCapture.read.getIndustriesByLimit([start, limit]);

            expect(result[0].length).to.equal(2); // Check number of returned industries
            expect(result[1][0]).to.equal("IndustryA");
            expect(result[1][1]).to.equal("IndustryB");
        });

        it("should return the correct industries for a different start and limit", async function () {
            const start = BigInt(2);
            const limit = BigInt(2);

            const { carbonCapture, owner, addr1, addr2, addr3 } = await loadFixture(deployContributeFixture);

            await carbonCapture.write.registerIndustry([addr1.account.address, "IndustryA", BigInt(2), "52.5200N", "13.4050E"], {
                account: owner.account
            });
            await carbonCapture.write.registerIndustry([addr2.account.address, "IndustryB", BigInt(1), "6.5200N", "7.4050E"], {
                account: owner.account
            });
            await carbonCapture.write.registerIndustry([addr3.account.address, "IndustryC", BigInt(1), "7.5200N", "11.4050E"], {
                account: owner.account
            });


            const result = await carbonCapture.read.getIndustriesByLimit([start, limit]);

            expect(result[0].length).to.equal(2);
            expect(result[1][0]).to.equal("IndustryB");
            expect(result[1][1]).to.equal("IndustryC");
        });

        it("should return less industries if limit exceeds total", async function () {
            // Test with a limit larger than the remaining industries
            const start = BigInt(2);
            const limit = BigInt(10);

            const { carbonCapture, owner, addr1, addr2, addr3 } = await loadFixture(deployContributeFixture);

            await carbonCapture.write.registerIndustry([addr1.account.address, "IndustryA", BigInt(2), "52.5200N", "13.4050E"], {
                account: owner.account
            });
            await carbonCapture.write.registerIndustry([addr2.account.address, "IndustryB", BigInt(1), "6.5200N", "7.4050E"], {
                account: owner.account
            });
            await carbonCapture.write.registerIndustry([addr3.account.address, "IndustryC", BigInt(1), "7.5200N", "11.4050E"], {
                account: owner.account
            });

            const result = await carbonCapture.read.getIndustriesByLimit([start, limit]);

            expect(result[0].length).to.equal(2);
            expect(result[1][0]).to.equal("IndustryB");
            expect(result[1][1]).to.equal("IndustryC");
        });

        it("should revert if start index is invalid", async function () {
            // Test with an invalid start index
            const { carbonCapture } = await loadFixture(deployContributeFixture);

            expect(carbonCapture.read.getIndustriesByLimit([BigInt(0), BigInt(2)])).to.be.revertedWith("Invalid start index");
            expect(carbonCapture.read.getIndustriesByLimit([BigInt(10), BigInt(2)])).to.be.revertedWith("Invalid start index");
        });
    })
    describe("Capture", function () {

        it("Should allow an industry to capture carbon", async function () {
            const { carbonCapture, owner, addr1 } = await loadFixture(deployContributeFixture);

            await carbonCapture.write.registerIndustry([addr1.account.address, "IndustryA", BigInt(1), "52.5200N", "13.4050E"], {
                account: owner.account
            });
            await carbonCapture.write.captureCarbon([BigInt(2024), BigInt(1), BigInt(100)], {
                account: addr1.account
            });

            const captured = await carbonCapture.read.getCarbonCaptured([addr1.account.address, BigInt(2024), BigInt(1)]);

            expect(captured).to.equal(100);
        });

        it("Should allow to get the total carbon captured by an industry", async function () {
            const { carbonCapture, owner, addr1 } = await loadFixture(deployContributeFixture);


            await carbonCapture.write.registerIndustry([addr1.account.address, "IndustryA", BigInt(1), "52.5200N", "13.4050E"], {
                account: owner.account
            });
            await carbonCapture.write.captureCarbon([BigInt(2024), BigInt(1), BigInt(100)], {
                account: addr1.account
            });
            await carbonCapture.write.captureCarbon([BigInt(2024), BigInt(2), BigInt(200)], {
                account: addr1.account
            });

            const totalCaptured = await carbonCapture.read.getTotalCarbonCaptured([addr1.account.address]);
            expect(totalCaptured).to.equal(300);
        });

        it("should not capture carbon for an invalid industry ID", async function () {
            const { carbonCapture, owner, addr1, addr2 } = await loadFixture(deployContributeFixture);

            await carbonCapture.write.registerIndustry([addr1.account.address, "IndustryA", BigInt(1), "52.5200N", "13.4050E"], {
                account: owner.account
            });

            expect(carbonCapture.write.captureCarbon([BigInt(2024), BigInt(1), BigInt(100)], {
                account: addr2.account
            })).to.be.revertedWith("Industry does not exist.");
        });

        it("Should allow the owner to verify the carbon captured", async function () {
            const { carbonCapture, owner, addr1 } = await loadFixture(deployContributeFixture);

            await carbonCapture.write.registerIndustry([addr1.account.address, "IndustryA", 1, "52.5200N", "13.4050E"], {
                account: owner.account
            });
            await carbonCapture.write.captureCarbon([BigInt(2024), BigInt(1), BigInt(100)], {
                account: addr1.account
            });

            const hash = await carbonCapture.write.verifyCarbon([addr1.account.address, BigInt(2024), BigInt(1)], {
                account: owner.account
            });

            const logs = await carbonCapture.getEvents.CarbonVerified()
            const captured = await carbonCapture.read.getCarbonCaptured([addr1.account.address, BigInt(2024), BigInt(1)]);

            expect(hash).to.be.a('string')
            expect(logs[0].eventName).equal('CarbonVerified')
            expect(captured).to.equal(100);
        });

        it("should calculate total carbon captured all industry correctly", async function () {
            const { carbonCapture, owner, addr1, addr2, addr3 } = await loadFixture(deployContributeFixture);

            await carbonCapture.write.registerIndustry([addr1.account.address, "IndustryA", BigInt(1), "52.5200N", "13.4050E"], {
                account: owner.account
            });
            await carbonCapture.write.registerIndustry([addr2.account.address, "IndustryB", BigInt(2), "45.1500N", "11.1150E"], {
                account: owner.account
            });
            await carbonCapture.write.registerIndustry([addr3.account.address, "IndustryC", BigInt(3), "51.2200N", "12.3050E"], {
                account: owner.account
            });
            await carbonCapture.write.captureCarbon([BigInt(2024), BigInt(1), BigInt(100)], {
                account: addr1.account
            });
            await carbonCapture.write.captureCarbon([BigInt(2024), BigInt(1), BigInt(1000)], {
                account: addr2.account
            });
            await carbonCapture.write.captureCarbon([BigInt(2024), BigInt(1), BigInt(500)], {
                account: addr3.account
            });

            const total = await carbonCapture.read.getTotalCarbonCapturedAllIndustries();

            expect(total).equal(1600)
        });

        it("should calculate total carbon captured by year correctly", async function () {
            const { carbonCapture, owner, addr1 } = await loadFixture(deployContributeFixture);

            await carbonCapture.write.registerIndustry([addr1.account.address, "IndustryA", BigInt(1), "52.5200N", "13.4050E"], {
                account: owner.account
            });
            await carbonCapture.write.captureCarbon([BigInt(2024), BigInt(1), BigInt(100)], {
                account: addr1.account
            });
            await carbonCapture.write.captureCarbon([BigInt(2024), BigInt(2), BigInt(150)], {
                account: addr1.account
            });
            await carbonCapture.write.captureCarbon([BigInt(2024), BigInt(3), BigInt(300)], {
                account: addr1.account
            });

            const total = await carbonCapture.read.getTotalCarbonCapturedByYear([BigInt(2024)]);

            expect(total).to.equal(550)
        });

        it("should list captured carbon by industry address correctly", async function () {
            const { carbonCapture, owner, addr1 } = await loadFixture(deployContributeFixture);

            await carbonCapture.write.registerIndustry([addr1.account.address, "IndustryA", BigInt(1), "52.5200N", "13.4050E"], {
                account: owner.account
            });
            await carbonCapture.write.captureCarbon([BigInt(2024), BigInt(1), BigInt(100)], {
                account: addr1.account
            });
            await carbonCapture.write.captureCarbon([BigInt(2024), BigInt(2), BigInt(150)], {
                account: addr1.account
            });
            await carbonCapture.write.captureCarbon([BigInt(2024), BigInt(3), BigInt(300)], {
                account: addr1.account
            });

            // Verify month 1
            await carbonCapture.write.verifyCarbon([addr1.account.address, BigInt(2024), BigInt(1)], {
                account: owner.account
            });
            
            const result = await carbonCapture.read.listCapturedCarbonByIndustry([addr1.account.address]);

            // Verify data for year 2024, month 1 and 2
            expect(result[0].year).to.equal(2024);
            expect(result[0].month).to.equal(1);
            expect(result[0].carbonCaptured).to.equal(100);
            expect(result[0].verified).to.equal(true);

            expect(result[1].year).to.equal(2024);
            expect(result[1].month).to.equal(2);
            expect(result[1].carbonCaptured).to.equal(150);
            expect(result[1].verified).to.equal(false);
        })

    })

});