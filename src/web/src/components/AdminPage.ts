import { LitElement, TemplateResult, css, html, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";
import { RouterPage } from "./Root";
import { AdminPanelService } from "../services/AdminPanelService";
import { OrderItem } from "@shared/types/OrderItem";
import { CreateProductFormModelSchema } from "../../../shared/formModels/ProductFormModel";
import { ZodError } from "zod";

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
    private product: OrderItem | null = null;

    @state()
    private loading: boolean = true;

    @state()
    private errors: Record<string, string> = {};

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
                this.product = product;
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
            const results: OrderItem[] | undefined = await this.adminPanelService.getProducts();
            this.products = results ?? [];
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
                                    <button @click=${(): void => this.editPage(product.id)}>Edit</button>
                                    <button
                                        class="delete"
                                        @click=${(): void => this.deleteProduct(product.id)}>Delete</button>
                                </td>
                            </tr>
                        `;
                    })}
                </tbody>
            </table>

        `;
    }

    private renderCreateForm(): TemplateResult {
        return html`
            <h1>Create Product</h1>
            <form @submit=${this.onSubmitCreate.bind(this)}>
                ${this.renderInput("title", "Title", "text")}
                ${this.renderInput("description", "Description", "textarea")}
                ${this.renderInput("price", "Price", "number")}
                ${this.renderInput("tags", "Tags (separate by comma)", "text")}
                ${this.renderInput("authors", "Authors (separate by comma)", "text")}
                ${this.renderInput("thumbnail", "Thumbnail", "text")}
                ${this.renderInput("images", "Images (separate by comma)", "text")}
                <button type="submit">Create</button>
            </form>
        `;
    }

    private renderEditForm(): TemplateResult {
        if (!this.product) return nothing as unknown as TemplateResult;
        return html`
            <h1>Edit Product</h1>
            <form @submit=${this.onSubmitEdit.bind(this)}>
                ${this.renderInput("title", "Title", "text", this.product.title)}
                ${this.renderInput("description", "Description", "textarea", this.product.description)}
                ${this.renderInput("price", "Price", "number", this.product.price)}
                ${this.renderInput("thumbnail", "Thumbnail", "text", this.product.thumbnail)}
                ${this.renderInput("quantity", "Quantity", "number", this.product.quantity)}
                ${this.renderInput(
                    "tags",
                    "Tags (separate by comma)",
                    "text",
                    this.product.tags.map((tag) => tag).join(", ")
                )}
                ${this.renderInput(
                    "authors",
                    "Authors (separate by comma)",
                    "text",
                    this.product.authors.map((author) => author).join(", ")
                )}
                ${this.renderInput(
                    "images",
                    "Images (separate by comma)",
                    "text",
                    this.product.images.map((image) => image).join(", ")
                )}
                <button type="submit">Save</button>
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
                ? html`<textarea required id="${id}" name="${id}" placeholder=${placeholder}>${value}</textarea>`
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

    private changeRoute(route: RouterPage, options?: { searchParams?: Record<string, any> }): void {
        const params: string = options?.searchParams ? new URLSearchParams(options.searchParams).toString() : "";
        const url: string = params ? `#${route}?${params}` : `#${route}`;
        window.location.href = url;
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

    private editPage(id: number): void {
        this.changeRoute(RouterPage.AdminEditProductPage, { searchParams: { id } });
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
                authors: String(data.authors || "").split(",").map((author: string) => author.trim()),
                tags: String(data.tags || "").split(",").map((tag: string) => tag.trim()),
                thumbnailUrl: String(data.thumbnail || ""),
                imagesUrl: String(data.images || "").split(",").map((image: string) => image.trim())
            });
    
            console.log("Form Data:", parsedData); // Log the form data to ensure it's correct
    
            const response: { errors: any[]; data: OrderItem } = await this.adminPanelService.createProduct(parsedData);
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
        } catch (error) {
            if (error.message === "Unauthorized") {
                alert("You are not authorized to perform this action. Please log in.");
                return;
            }
    
            if (error instanceof ZodError) {
                this.errors = error.errors.reduce((prev: Record<string, string>, curr: any) => {
                    return { ...prev, [curr.path[0]]: curr.message };
                }, {});
    
                console.error(this.errors);
                return;
            }
    
            console.error("[Admin Product Create]: Internal error", error);
            alert("An internal error occurred. Please try again later.");
        }
    }
}    