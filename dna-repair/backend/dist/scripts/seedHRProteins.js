"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../config/database");
const Protein_1 = require("../models/Protein");
const hrProteins = [
    {
        name: "BRCA1",
        uniprotId: "P38398",
        pathway: "HR",
        description: "Breast cancer type 1 susceptibility protein",
        function: "DNA repair and transcription regulation",
        interactions: ["BRCA2", "RAD51", "BARD1", "PALB2"],
        recruitmentTime: 15
    },
    {
        name: "BRCA2",
        uniprotId: "P51587",
        pathway: "HR",
        description: "Breast cancer type 2 susceptibility protein",
        function: "DNA repair and homologous recombination",
        interactions: ["BRCA1", "RAD51", "PALB2"],
        recruitmentTime: 20
    },
    {
        name: "RAD51",
        uniprotId: "Q06609",
        pathway: "HR",
        description: "DNA repair protein RAD51 homolog 1",
        function: "Homologous recombination and DNA repair",
        interactions: ["BRCA1", "BRCA2", "RAD51B", "RAD51C", "RAD51D"],
        recruitmentTime: 25
    },
    {
        name: "MRE11",
        uniprotId: "P49959",
        pathway: "HR",
        description: "Double-strand break repair protein MRE11",
        function: "DNA double-strand break repair",
        interactions: ["RAD50", "NBS1"],
        recruitmentTime: 0
    },
    {
        name: "RAD50",
        uniprotId: "Q92878",
        pathway: "HR",
        description: "DNA repair protein RAD50",
        function: "DNA double-strand break repair",
        interactions: ["MRE11", "NBS1"],
        recruitmentTime: 0
    },
    {
        name: "NBS1",
        uniprotId: "O60934",
        pathway: "HR",
        description: "Nibrin",
        function: "DNA double-strand break repair",
        interactions: ["MRE11", "RAD50"],
        recruitmentTime: 0
    },
    {
        name: "ATM",
        uniprotId: "Q13315",
        pathway: "HR",
        description: "Serine-protein kinase ATM",
        function: "DNA damage response and cell cycle checkpoint",
        interactions: ["BRCA1", "NBS1", "MRE11"],
        recruitmentTime: 5
    },
    {
        name: "PALB2",
        uniprotId: "Q86YC2",
        pathway: "HR",
        description: "Partner and localizer of BRCA2",
        function: "DNA repair and homologous recombination",
        interactions: ["BRCA1", "BRCA2", "RAD51"],
        recruitmentTime: 20
    }
];
const seedDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, database_1.connectDB)();
        // Clear existing HR proteins
        yield Protein_1.Protein.deleteMany({ pathway: 'HR' });
        // Insert new proteins
        yield Protein_1.Protein.insertMany(hrProteins);
        console.log('Successfully seeded HR proteins');
        process.exit(0);
    }
    catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
});
seedDatabase();
