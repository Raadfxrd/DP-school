import { LitElement, TemplateResult, css, html, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";
import { RouterPage } from "./Root";
import { AdminPanelService } from "../services/AdminPanelService";
import { OrderItem } from "@shared/types/OrderItem";
import { CreateProductFormModelSchema } from "../../../shared/formModels/ProductFormModel";

type InputElementType = "text" | "number" | "url" | "textarea";

@customElement("admin-page")
export class AdminPage extends LitElement {
    public static styles = css`
        main {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            justify-content: center;
            align-items: center;
            padding: 1rem;
        }

        h1 {
            color: var(--theme-color-yellow);
        }

        h3 {
            color: var(--theme-color-yellow);
            background-color: #f1f1f1;
            padding: 1.5rem;
            width: 100%;
            align-self: center;
            text-align: center;
            font-size: 24px;
        }

        form,
        table {
            width: 100%;
            margin: 1rem 0;
        }

        button {
            border: none;
            cursor: pointer;
            background-color: #957dad;
            color: #ffffff;
            font-family: sans-serif;
            font-size: 16px;
            padding: 10px;
            border-radius: 25px;
            width: 100%;
            box-sizing: border-box;
        }

        button.delete {
            background-color: #5a4e7c;
        }

        input,
        select,
        textarea {
            border: 2px solid #957dad;
            outline: none;
            border-radius: var(--border-radius);
            font-size: 1rem;
            padding: 10px;
            width: 100%;
            box-sizing: border-box;
            margin-bottom: 1rem;
        }

        label {
            font-family: sans-serif;
            color: #957dad;
            margin-bottom: 0.5rem;
            display: block;
        }

        span {
            color: red;
            font-size: 0.8rem;
        }

        textarea {
            resize: vertical;
        }

        table {
            margin-top: 1rem;
            border-collapse: collapse;
            width: 100%;
        }

        th {
            background-color: #957dad;
            color: #ffffff;
            font-weight: bold;
            padding: 0.5rem;
        }

        td {
            padding: 0.5rem;
            text-align: left;
        }

        td img {
            width: 50px;
            height: 50px;
            object-fit: cover;
        }

        tr:hover {
            background-color: #f1f1f1;
        }

        .form-container {
            background-color: #f4f4f9;
            padding: 20px;
            border-radius: 15px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            width: 100%;
            box-sizing: border-box;
        }

        .actions {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }

        .actions button {
            width: auto;
        }

        .table-footer {
            display: flex;
            justify-content: center;
            margin-top: 1rem;
        }
    `;

    private adminPanelService: AdminPanelService = new AdminPanelService();

    @state()
    private products: OrderItem[] = [];

    @state()
    private loading: boolean = true;

    @state()
    private errors: Record<string, string> = {};

    private changeRoute: any;

    public override async connectedCallback(): Promise<void> {
        super.connectedCallback();
        await this.updateProducts();
        void this.fetchProducts();

        const searchParams: URLSearchParams = new URLSearchParams(location.search);
        const id: number = Number(searchParams.get("id"));
        if (id && !isNaN(id)) {
            const product: OrderItem = await this.adminPanelService.getProduct(id);
            if (product) {
                this.loading = false;
            }
        }
    }

    public updated(changedProperties: Map<string | number | symbol, unknown>): void {
        if (changedProperties.has("products")) {
            void this.fetchProducts();
        }
    }

    public async fetchProducts(): Promise<void> {
        try {
            const result: { products: OrderItem[] } = await this.adminPanelService.getProducts();
            this.products = result.products;
            this.loading = false;
        } catch (error) {
            console.error("Error during fetching products:", error);
            this.products = [];
            this.loading = false;
        }
    }

    public render(): TemplateResult {
        return html`
            <main>
                ${this.loading ? html`<h1>Loading...</h1>` : nothing} ${this.renderOverview()}
                ${this.renderCreateForm()} ${this.renderEditForm()}
            </main>
        `;
    }

    private renderOverview(): TemplateResult {
        if (!this.products) {
            this.products = [];
        }

        return html`
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Thumbnail</th>
                        <th>Description</th>
                        <th>Authors</th>
                        <th>Tags</th>
                        <th>Price</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${this.products.map((product: OrderItem) => {
                        return html`
                            <tr>
                                <td>${product.id}</td>
                                <td>${product.title}</td>
                                <td><img src="${product.thumbnail}" /></td>
                                <td>${product.description}</td>
                                <td>${product.authors}</td>
                                <td>${product.tags}</td>
                                <td>${product.price}</td>
                                <td class="actions">
                                    <button
                                        class="delete"
                                        @click=${(): any => this.deleteProduct(product.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        `;
                    })}
                </tbody>
            </table>
            <br /><br /><br /><br /><br /><br />
        `;
    }

    private renderCreateForm(): TemplateResult {
        return html`
            <h3>Create game</h3>
            <form @submit=${this.onSubmitCreate.bind(this)}>
                ${this.renderInput("title", "Title", "text")}
                ${this.renderInput("description", "Description", "textarea")}
                ${this.renderInput("price", "Price", "number")}
                ${this.renderInput("tags", "Tags (separate by comma)", "text")}
                ${this.renderInput("authors", "Authors (separate by comma)", "text")}
                ${this.renderInput("thumbnail", "Thumbnail", "text")}
                ${this.renderInput("images", "Images (separate by comma)", "text")}
                <button type="submit">Create</button>

                <br /><br /><br /><br /><br /><br /><br />
            </form>
        `;
    }

    private renderEditForm(): TemplateResult {
        return html`
            <h3>Edit game</h3>
            <form @submit=${this.onSubmitEdit.bind(this)}>
                ${this.renderInput("edit-id", "Product ID", "number")}
                ${this.renderInput("edit-title", "Title", "text")}
                ${this.renderInput("edit-description", "Description", "textarea")}
                ${this.renderInput("edit-price", "Price", "number")}
                ${this.renderInput("edit-tags", "Tags (separate by comma)", "text")}
                ${this.renderInput("edit-authors", "Authors (separate by comma)", "text")}
                ${this.renderInput("edit-thumbnail", "Thumbnail", "text")}
                ${this.renderInput("edit-images", "Images (separate by comma)", "text")}
                <button type="submit">Edit</button>
            </form>
        `;
    }

    private renderInput(
        id: string,
        placeholder: string,
        type: InputElementType | "textarea" = "text",
        value: any = ""
    ): TemplateResult {
        const error: string | undefined = this.errors[id];
        return html`
            <label for="${id}">${placeholder}</label>
            ${type === "textarea"
                ? html`<textarea required id="${id}" name="${id}" placeholder=${placeholder}>
${value}</textarea
                  >`
                : html`<input
                      required
                      id="${id}"
                      name="${id}"
                      type="${type}"
                      step="0.01"
                      placeholder=${placeholder}
                      value=${value}
                  />`}
            ${error ? html`<span>${error}</span>` : nothing}
        `;
    }

    private async updateProducts(): Promise<void> {
        try {
            const result: { products: OrderItem[] } = await this.adminPanelService.getProducts();
            this.products = result.products;
        } catch (error) {
            console.error("Error updating products:", error);
            this.products = [];
        }
    }

    private async deleteProduct(id: number): Promise<void> {
        const confirmation: boolean = confirm("Are you sure you want to delete this product?");
        if (!confirmation) return;

        await this.adminPanelService.deleteProduct(id);
        await this.updateProducts();
    }

    private async onSubmitCreate(event: SubmitEvent): Promise<void> {
        event.preventDefault();
        const form: HTMLFormElement = event.target as HTMLFormElement;
        const formData: FormData = new FormData(form);
        const data: Record<string, any> = Object.fromEntries(formData.entries());

        this.errors = {};

        try {
            const parsedData: any = CreateProductFormModelSchema.parse({
                id: data.id ? Number(data.id) : undefined,
                title: String(data.title || ""),
                description: String(data.description || ""),
                price: String(data.price || "0"),
                authors: String(data.authors || "")
                    .split(",")
                    .map((author: string) => author.trim()),
                tags: String(data.tags || "")
                    .split(",")
                    .map((tag: string) => tag.trim()),
                thumbnail: String(data.thumbnail || ""),
                images: String(data.images || "")
                    .split(",")
                    .map((image: string) => image.trim()),
            });

            const response: { errors: any[]; data: OrderItem } = await this.adminPanelService.createProduct(
                parsedData
            );
            const { errors, data: resp } = response;

            if (errors && errors.length) {
                this.errors = errors.reduce((prev: Record<string, string>, curr) => {
                    return { ...prev, [curr.field[0]]: curr.message };
                }, {});
                return;
            }

            if (resp?.id) {
                this.changeRoute(RouterPage.AdminEditProductPage, { searchParams: { id: resp.id } });
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error("[Admin Product Create]:", error.message);
            } else {
                console.error("[Admin Product Create]: An unknown error occurred", error);
            }
            alert("An internal error occurred. Please try again later.");
        }
    }

    private async onSubmitEdit(event: SubmitEvent): Promise<void> {
        event.preventDefault();
        const form: HTMLFormElement = event.target as HTMLFormElement;
        const formData: FormData = new FormData(form);
        const data: Record<string, any> = Object.fromEntries(formData.entries());

        const productId: number = Number(data["edit-id"]);
        if (!productId) {
            alert("Please provide a valid Product ID.");
            return;
        }

        const updatedData: Partial<OrderItem> = {
            title: data["edit-title"] ? String(data["edit-title"]) : undefined,
            description: data["edit-description"] ? String(data["edit-description"]) : undefined,
            price: data["edit-price"] ? Number(data["edit-price"]) : undefined,
            authors: data["edit-authors"]
                ? String(data["edit-authors"])
                      .split(",")
                      .map((author: string) => author.trim())
                : undefined,
            tags: data["edit-tags"]
                ? String(data["edit-tags"])
                      .split(",")
                      .map((tag: string) => tag.trim())
                : undefined,
            thumbnail: data["edit-thumbnail"] ? String(data["edit-thumbnail"]) : undefined,
            images: data["edit-images"]
                ? String(data["edit-images"])
                      .split(",")
                      .map((image: string) => image.trim())
                : undefined,
        };

        try {
            const response: { errors: any[]; data: OrderItem } = await this.adminPanelService.updateProduct(
                productId,
                updatedData
            );
            const { errors } = response;

            if (errors && errors.length) {
                this.errors = errors.reduce((prev: Record<string, string>, curr) => {
                    return { ...prev, [curr.field[0]]: curr.message };
                }, {});
                return;
            }

            await this.updateProducts();
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error("[Admin Product Edit]: Internal error", error.message);
            } else {
                console.error("[Admin Product Edit]: An unknown error occurred", error);
            }
            alert("An internal error occurred. Please try again later.");
        }
    }
}
