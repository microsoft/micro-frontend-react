"use strict";

const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const pkg = require("../../package.json");

module.exports = class extends Generator {
    async prompting() {
        this.log(
            yosay(
                `Welcome to the Microsoft ${chalk.green(
                    `Employee Experience Framework v${pkg.version}`
                )} generator!`
            )
        );

        writing()
        {
            this.fs.copy(this.templatePath("examples/**/*"), this.destinationRoot());
            this.fs.copy(this.templatePath("examples/**/.*"), this.destinationRoot());
        }

        install()
        {
            this.log("\nSuccess! Follow the steps in README.md to install dependencies and run the app");
        }
    };

