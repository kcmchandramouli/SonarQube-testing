const vscode = require('vscode');
const toolcheck = require('../utils/toolsCheck');
const azcli = require('../utils/azcli');

const validBranchNameRegex = /^[a-zA-Z0-9/_-]+$/;

async function getValidBranchName() {
    return await vscode.window.showInputBox({
        placeHolder: "Enter New Branch Name: (e.g. task/master/123_playground)",
        validateInput: (newBranchName) => {
            if (!newBranchName) {
                return 'Branch name is required.';
            }
            if (!validBranchNameRegex.test(newBranchName)) {
                return 'Invalid characters in branch name. Use only letters, numbers, hyphens, underscores, and slashes.';
            }
            return null; // Validation passed
        }
    });
}

async function azCreateBranch(){
        
    const { exec } = require('child_process');

    const azclicheck = await toolcheck.azclicheck();
    if (azclicheck) {
        vscode.window.showInformationMessage(`Azure CLI is Installed`);
        const jqcheck = await toolcheck.jqcheck();
        if (jqcheck) {
            vscode.window.showInformationMessage(`jq Installed`);
        } else {
            vscode.window.showErrorMessage(`Please Install jq & try again`);
        }
    } else {
        vscode.window.showErrorMessage(`Please Install AZ CLI & try again`);
    }
    const selectedProject = await azcli.getProjectList();
    if (selectedProject) {
        vscode.window.showInformationMessage(`Selected Project: ${selectedProject}`);
        const selectedRepository = await azcli.getRepositoryList(selectedProject);
        if (selectedRepository) {
            vscode.window.showInformationMessage(`Selected Repository: ${selectedRepository}`);
            const selectedBranch = await azcli.getBranchList(selectedProject, selectedRepository);
            if (selectedBranch) {
                vscode.window.showInformationMessage(`Source Branch: ${selectedBranch}`);
                const newBranchName = await getValidBranchName();
                const newBranchStatus = await azcli.createBranch(selectedProject,selectedRepository,selectedBranch,newBranchName)
                if(newBranchStatus) {
                    vscode.window.showInformationMessage(`New Branch "${newBranchName}" created succesfully`);
                    console.log(`New Branch "${newBranchName}" created succesfully`);
                } else {
                    vscode.window.showErrorMessage('Failed to create Branch!! Please try again.');
                    console.log('Error: Failed to create branch.');
                }
            } else {
                vscode.window.showErrorMessage('Repository is not Initialized!! Please initialize the repository & try again.');
                console.log('Error: Repository is not Initialized!! Please initialize the repository & try again.');
            }
        }
    }
} 

module.exports = azCreateBranch;