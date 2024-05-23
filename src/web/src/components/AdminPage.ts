import { LitElement, html, css, CSSResult, TemplateResult } from "lit";
import { customElement, state } from "lit/decorators.js";

@customElement("admin-page")
export class AdminPage extends LitElement {
    static styles: CSSResult = css`
        :host {
            display: block;
            padding: 16px;
        }

        form {
            margin-top: 20px;
            background: #fbfbfa;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }

        input, textarea {
            width: 100%;
            padding: 10px;
            margin-bottom: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            box-sizing: border-box;
        }

        button {
            background-color: #957dad;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 1rem;
        }

        button:hover {
            background-color: #5a4e7c;
        }

        label {
            font-weight: bold;
            color: #333;
            margin-bottom: 5px;
            display: block;
        }
    `;

    @state()
    private gameName: string = "";

    @state()
    private gameDescription: string = "";

    @state()
    private gamePrice: string = "";

    @state()
    private gameFile: File | null = null;

    protected render(): TemplateResult {
        return html`
            <h2>Upload New Game</h2>
            <form @submit=${this.handleSubmit}>
                <label for="gameName">Game Name:</label>
                <input id="gameName" type="text" .value=${this.gameName} @input=${this.updateGameName} placeholder="Enter game name">

                <label for="description">Description:</label>
                <textarea id="description" .value=${this.gameDescription} @input=${this.updateGameDescription} placeholder="Enter game description"></textarea>

                <label for="price">Price:</label>
                <input id="price" type="text" .value=${this.gamePrice} @input=${this.updateGamePrice} placeholder="Enter price">

                <label for="gameFile">Game Image:</label>
                <input id="gameFile" type="file" @change=${this.updateGameFile}>

                <button type="submit">Upload Game</button>
            </form>
        `;
    }

    private updateGameName(e: InputEvent): void {
        const input = e.target as HTMLInputElement;
        this.gameName = input.value;
    }

    private updateGameDescription(e: InputEvent): void {
        const textarea = e.target as HTMLTextAreaElement;
        this.gameDescription = textarea.value;
    }

    private updateGamePrice(e: InputEvent): void {
        const input = e.target as HTMLInputElement;
        this.gamePrice = input.value;
    }

    private updateGameFile(e: InputEvent): void {
        const input = e.target as HTMLInputElement;
        this.gameFile = input.files ? input.files[0] : null;
    }

    private handleSubmit(e: SubmitEvent): void {
        e.preventDefault();
        console.log("Uploading game:", this.gameName, this.gameDescription, this.gamePrice, this.gameFile);

        // Implement the logic to send the data to your server
        const formData = new FormData();
        formData.append("name", this.gameName);
        formData.append("description", this.gameDescription);
        formData.append("price", this.gamePrice);
        formData.append("file", this.gameFile as Blob);

        // Fetch API or another method to send formData to the server
        // Example: fetch("your-api-endpoint", { method: "POST", body: formData });
    }
}
