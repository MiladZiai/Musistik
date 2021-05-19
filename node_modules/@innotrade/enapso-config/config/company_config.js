// ENAPSO Enterprise Configuration Management
// (C) Copyright 2019-2020 Innotrade GmbH, Herzogenrath, NRW, Germany
// Author: Alexander Schulze

// this is the company/enterprise configuration file across all business units, subsidiaries and departments
// here only configurations across an entire company/enterprise (headquarter) should be maintained

const { RootConfig } = require('./root_config');

class CompanyConfig extends RootConfig {
    constructor(data) {
        super(data);
        this.company = {
            name: 'Innotrade GmbH',
            address: 'An Vieslapp 29',
            city: 'Herzogenrath',
            zipcode: '52134',
            country: 'Germany',
            state: 'NRW',
            taxNo: '[TaxNo]',
            vatId: '[VatId]',
            registerCourt: '[RegisterCourt]',
            registerNo: '[RegisterNo]'
        };
    }
}

module.exports = {
    CompanyConfig,
    config: CompanyConfig
};
