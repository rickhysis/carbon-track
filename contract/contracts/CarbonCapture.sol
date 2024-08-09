// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CarbonCapture {

    address public owner;

    // Define a struct for monthly carbon data
    struct MonthlyCarbonData {
        uint256 carbonCaptured;
        bool verified;
    }

    // Define an industry struct
    struct Industry {
        uint256 industryId;
        string name;
        uint256 city;
        string latitude;
        string longitude;
        bool verified; // To check if industry is verified
        mapping(uint256 => mapping(uint256 => MonthlyCarbonData)) monthlyData; // Mapping of year to month to carbon data
    }

    struct CarbonData {
        uint256 year;
        uint256 month;
        uint256 carbonCaptured;
        bool verified;
    }

    // Mapping to store industries by their address
    mapping(address => Industry) industries;
    mapping(uint256 => address) industryById;
    uint256 public nextIndustryId;

    // Event to log carbon capture
    event CarbonCaptured(address indexed industryAddress, uint256 year, uint256 month, uint256 amount);
    event IndustryRegistered(address indexed industryAddress, uint256 industryId, string name);
    event CarbonVerified(address indexed industryAddress, uint256 year, uint256 month);


    // Modifier to check if the caller is the owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not the owner");
        _;
    }

    // Modifier to check if the industry verified
    modifier industryExists(address _address) {
        require(industries[_address].verified, "Industry does not verified");
        _;
    }

    constructor() {
        owner = msg.sender;
        nextIndustryId = 1;
    }

    // Function to transfer ownership
    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "New owner is the zero address");
        owner = newOwner;
    }

    // Function to register an industry
    function registerIndustry(address _industryAddress, string memory _name, uint256 _city, string memory _latitude, string memory _longitude) public onlyOwner {
        require(!industries[_industryAddress].verified, "Industry already registered");

        industries[_industryAddress].industryId = nextIndustryId;
        industries[_industryAddress].name = _name;
        industries[_industryAddress].verified = true;
        industries[_industryAddress].city = _city;
        industries[_industryAddress].latitude = _latitude;
        industries[_industryAddress].longitude = _longitude;

        industryById[nextIndustryId] = _industryAddress;

        emit IndustryRegistered(_industryAddress, nextIndustryId, _name);
        nextIndustryId++;
    }

    // Function to capture carbon for a specific month and year
    function captureCarbon(uint256 _year, uint256 _month, uint256 _amount) public industryExists(msg.sender) {
        require(_month >= 1 && _month <= 12, "Invalid month");
        require(!industries[msg.sender].monthlyData[_year][_month].verified, "Carbon data for this month already captured");
        
        industries[msg.sender].monthlyData[_year][_month].carbonCaptured += _amount;
        industries[msg.sender].monthlyData[_year][_month].verified = false;
        
        emit CarbonCaptured(msg.sender, _year, _month, _amount);
    }

    // Function to verify the carbon captured for a specific month and year
    function verifyCarbon(address _industryAddress, uint256 _year, uint256 _month) public onlyOwner {
        require(_month >= 1 && _month <= 12, "Invalid month");
        require(industries[_industryAddress].monthlyData[_year][_month].carbonCaptured > 0, "No data to verify");

        industries[_industryAddress].monthlyData[_year][_month].verified = true;

        emit CarbonVerified(_industryAddress, _year, _month);
    }

    // Function to get the carbon captured by an industry for a specific month and year
    function getCarbonCaptured(address _industryAddress, uint256 _year, uint256 _month) public view industryExists(_industryAddress) returns (uint256) {
        require(_month >= 1 && _month <= 12, "Invalid month");
        //require(industries[_industryAddress].monthlyData[_year][_month].verified, "No data for this month");

        return industries[_industryAddress].monthlyData[_year][_month].carbonCaptured;
    }

    // Function to get the total carbon captured by an industry
    function getTotalCarbonCaptured(address _industryAddress) public view industryExists(_industryAddress) returns (uint256) {
        uint256 total = 0;
        for (uint256 year = 2023; year <= block.timestamp / 31556926 + 1970; year++) {
            for (uint256 month = 1; month <= 12; month++) {
                if (industries[_industryAddress].monthlyData[year][month].carbonCaptured > 0) {
                    total += industries[_industryAddress].monthlyData[year][month].carbonCaptured;
                }
            }
        }
        return total;
    }

    // Function to get the total carbon captured across all industries for a specific year
    function getTotalCarbonCapturedByYear(uint256 _year) public view returns (uint256) {
        uint256 totalCarbonCaptured = 0;

        for (uint256 id = 1; id < nextIndustryId; id++) {
            address industryAddress = industryById[id];
            Industry storage industry = industries[industryAddress];
            
            for (uint256 month = 1; month <= 12; month++) {
                totalCarbonCaptured += industry.monthlyData[_year][month].carbonCaptured;
            }
        }

        return totalCarbonCaptured;
    }

    // Function to get the total carbon captured across all industries
    function getTotalCarbonCapturedAllIndustries() public view returns (uint256) {
        uint256 totalCarbonCaptured = 0;

        for (uint256 id = 1; id < nextIndustryId; id++) {
            address industryAddress = industryById[id];
            Industry storage industry = industries[industryAddress];
            
            for (uint256 year = 2023; year <= block.timestamp / 31556926 + 1970; year++) {
                for (uint256 month = 1; month <= 12; month++) {
                    totalCarbonCaptured += industry.monthlyData[year][month].carbonCaptured;
                }
            }
        }

        return totalCarbonCaptured;
    }

    // Function to get industry details by address
    function getIndustryDetails(address _industryAddress) public view industryExists(_industryAddress) returns (uint256, string memory, uint256, string memory, string memory, bool) {
        Industry storage industry = industries[_industryAddress];
        return (industry.industryId, industry.name, industry.city, industry.latitude, industry.longitude, industry.verified);
    }

    // Function to get industry details by ID
    function getIndustryById(uint256 _industryId) public view returns (address, string memory, uint256, string memory, string memory, bool) {
        address industryAddress = industryById[_industryId];
        require(industryAddress != address(0), "Industry ID not found");
        Industry storage industry = industries[industryAddress];
        return (industryAddress, industry.name, industry.city, industry.latitude, industry.longitude, industry.verified);
    }

    // Function to get industries by limit and offset
    function getIndustriesByLimit(uint256 start, uint256 limit) public view returns (address[] memory, string[] memory, uint256[] memory, string[] memory, string[] memory, uint256[] memory) {
        uint256 totalIndustries = nextIndustryId - 1;
        require(start > 0 && start <= totalIndustries, "Invalid start index");

        uint256 end = start + limit - 1;
        if (end > totalIndustries) {
            end = totalIndustries;
        }

        uint256 resultCount = end - start + 1;
        uint256 offset = start;

        address[] memory addresses = new address[](resultCount);
        string[] memory names = new string[](resultCount);
        uint256[] memory cities = new uint256[](resultCount);
        string[] memory latitudes = new string[](resultCount);
        string[] memory longitudes = new string[](resultCount);
        uint256[] memory totalCarbonCaptured = new uint256[](resultCount);

        for (uint256 i = 0; i < resultCount; i++) {
            address industryAddress = industryById[offset + i];
            Industry storage industry = industries[industryAddress];

            addresses[i] = industryAddress;
            names[i] = industry.name;
            cities[i] = industry.city;
            latitudes[i] = industry.latitude;
            longitudes[i] = industry.longitude;
            totalCarbonCaptured[i] = getTotalCarbonCaptured(industryAddress);
        }

        return (addresses, names, cities, latitudes, longitudes, totalCarbonCaptured);
    }

    function listCapturedCarbonByIndustry(address _industryAddress) public view industryExists(_industryAddress) returns (CarbonData[] memory) {
        Industry storage industry = industries[_industryAddress];

        uint256 yearStart = 2023;
        uint256 yearEnd = block.timestamp / 31556926 + 1970;
        uint256 months = 12;

        // Create an array to hold the results with maximum possible size
        CarbonData[] memory tempData = new CarbonData[]((yearEnd - yearStart + 1) * months);

        uint256 index = 0;
        for (uint256 year = yearStart; year <= yearEnd; year++) {
            for (uint256 month = 1; month <= months; month++) {
                uint256 carbonCaptured = industry.monthlyData[year][month].carbonCaptured;
                if (carbonCaptured > 0) {
                    tempData[index] = CarbonData({
                        year: year,
                        month: month,
                        carbonCaptured: carbonCaptured,
                        verified: industry.monthlyData[year][month].verified
                    });
                    index++;
                }
            }
        }

        // Resize the array to the actual size
        CarbonData[] memory data = new CarbonData[](index);
        for (uint256 i = 0; i < index; i++) {
            data[i] = tempData[i];
        }

        return data;
    }

}

