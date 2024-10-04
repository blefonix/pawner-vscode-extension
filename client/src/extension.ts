import * as path from "node:path";
import { workspace, type ExtensionContext } from "vscode";

import {
	LanguageClient,
	type LanguageClientOptions,
	type ServerOptions,
	TransportKind,
} from "vscode-languageclient/node";

let client: LanguageClient;

export function activate(context: ExtensionContext) {
	// The server is implemented in node
	const serverModule = context.asAbsolutePath(
		path.join("server", "out", "server.js"),
	);

	// If the extension is launched in debug mode then the debug server options are used
	// Otherwise the run options are used
	const serverOptions: ServerOptions = {
		run: { module: serverModule, transport: TransportKind.ipc },
		debug: {
			module: serverModule,
			transport: TransportKind.ipc,
		},
	};

	// Options to control the language client
	const clientOptions: LanguageClientOptions = {
		// Register the server for plain text documents
		documentSelector: [{ scheme: "file", language: "pawn" }],
		synchronize: {
			// Notify the server about file changes to '.clientrc files contained in the workspace
			fileEvents: workspace.createFileSystemWatcher("**/.pwn"),
		},
	};

	// Create the language client and start the client.
	client = new LanguageClient(
		"languageServerPawnClient",
		"languageServerPawnServer",
		serverOptions,
		clientOptions,
	);

	// Start the client. This will also launch the server
	client.start();
}

export function deactivate(): Thenable<void> | undefined {
	if (!client) {
		return undefined;
	}
	return client.stop();
}

// // The module 'vscode' contains the VS Code extensibility API
// // Import the module and reference it with the alias vscode in your code below
// import * as vscode from "vscode";

// // This method is called when your extension is activated
// // Your extension is activated the very first time the command is executed
// export function activate(context: vscode.ExtensionContext) {
// 	// Use the console to output diagnostic information (console.log) and errors (console.error)
// 	// This line of code will only be executed once when your extension is activated
// 	console.log('Congratulations, your extension "pawner" is now active!');

// 	// The command has been defined in the package.json file
// 	// Now provide the implementation of the command with registerCommand
// 	// The commandId parameter must match the command field in package.json
// 	const disposable = vscode.commands.registerCommand(
// 		"pawner.installOpenMP",
// 		() => {
// 			// The code you place here will be executed every time your command is executed
// 			// Display a message box to the user
// 			vscode.window.showInformationMessage(
// 				"Pawner has installed the open.mp successfully!",
// 			);
// 		},
// 	);

// 	// Formatter implemented using VSCode Extension API
// 	// const pawnFormatter = vscode.languages.registerDocumentFormattingEditProvider(
// 	// 	"Pawn",
// 	// 	{
// 	// 		provideDocumentFormattingEdits(
// 	// 			document: vscode.TextDocument,
// 	// 		): vscode.TextEdit[] {
// 	// 			const firstLine = document.lineAt(0);
// 	// 			if (firstLine.text !== "42") {
// 	// 				return [vscode.TextEdit.insert(firstLine.range.start, "42\n")];
// 	// 			}
// 	// 		},
// 	// 	},
// 	// );

// 	context.subscriptions.push(disposable);
// 	// context.subscriptions.push(pawnFormatter);
// }

// // This method is called when your extension is deactivated
// export function deactivate() {}
