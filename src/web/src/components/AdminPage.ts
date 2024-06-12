import { LitElement, TemplateResult, css, html, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";
import { RouterPage } from "./Root";
import { AdminPanelService } from "../services/AdminPanelService";
import { Product } from "@shared/types/Product";
import { CreateProductFormModelSchema } from "../../../shared/formModels/ProductFormModel";
import { ZodError } from "zod";

type InputElementType = "text" | "number" | "url" | "textarea";

@customElement("admin-page")
export class AdminPage extends LitElement {
    public static styles = css`
        /* Common Styles */
        main {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            justify-content: center;
            align-items: center;
        }

        h1 {
            color: var(--theme-color-yellow);
        }

        form, table {
            width: 100%;
            max-width: 550px;
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
        }

        button.delete {
            background-color: #5a4e7c;
        }

        input, select, textarea {
            border: 2px solid #957dad;
            outline: none;
            border-radius: var(--border-radius);
            font-size: 1rem;
            padding: 10px;
        }

        label {
            font-family: sans-serif;
            color: #957dad;
            margin-bottom: -0.5rem;
        }

        span {
            margin: 0;
            padding: 0;
            margin-top: -0.5rem;
            color: red;
        }

        textarea {
            resize: vertical;
        }

        table {
            margin-top: 1rem;
        }

        th {
            background-color: #957dad;
            color: #ffffff;
            font-weight: bold;
            padding: 0.5rem;
        }

        td {
            padding: 0.5rem;
        }

        tr:nth-child(even) {
            background-color: #f2f2f2;
        }

        tr:hover {
            background-color: #f1f1f1;
        }

        .table-footer, .navigation {
            display: flex;
            justify-content: space-between;
            width: 100%;
            gap: 1rem;
        }

        .navigation {
            align-items: center;
            gap: 1rem;
        }

        .actions {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 0.5rem;
        }

        .actions button {
            width: 100%;
        }
    `;

    private adminPanelService = new AdminPanelService();

    @state()
    private page = 1;

    @state()
    private pages = 1;

    @state()
    private limit = 10;

    @state()
    private products: Product[] = [];

    @state()
    private product: Product | null = null;

    @state()
    private loading = true;

    @state()
    private errors: Record<string, string> = {};

    public render(): TemplateResult {
        return html`
            <main>
                ${this.loading ? html`<h1>Loading...</h1>` : nothing}
                ${this.renderOverview()}
                ${this.renderCreateForm()}
                ${this.renderEditForm()}
            </main>
        `;
    }

    private renderOverview(): TemplateResult {
        return html`
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Price</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${this.products.map(
                        (product) => html`
                            <tr>
                                <td>${product.id}</td>
                                <td>${product.title}</td>
                                <td>${product.price}</td>
                                <td class="actions">
                                    <button @click=${() => this.editPage(product.id)}>Edit</button>
                                    <button class="delete" @click=${() => this.deleteProduct(product.id)}>Delete</button>
                                </td>
                            </tr>
                        `,
                    )}
                </tbody>
            </table>

            <div class="table-footer">
                <button @click=${() => this.changeRoute(RouterPage.AdminCreateProductPage)}>Add Product</button>

                <div class="navigation">
                    <span>Items per page</span>
                    <input type="number" min="1" max="100" name="limit" value="10" @input=${this.onLimitChange} />

                    <span>Page ${this.page} of ${this.pages}</span>
                    <button @click=${this.previousPage.bind(this)}>Previous</button>
                    <button @click=${this.nextPage.bind(this)}>Next</button>
                </div>
            </div>
        `;
    }

    private renderCreateForm(): TemplateResult {
        return html`
            <h1>Create Product</h1>
            <form @submit=${this.onSubmitCreate.bind(this)}>
                ${this.renderInput("title", "Title", "text")}
                ${this.renderInput("description", "Description", "textarea")}
                ${this.renderInput("price", "Price", "number")}
                <label for="thumbnail">Thumbnail</label>
                <input required id="thumbnail" name="thumbnail" type="file" accept="image/*" />
                ${this.renderInput("url", "URL", "url")}
                <label for="type">Type</label>
                <select id="type" name="type">
                    <option value="game">Game</option>
                    <option value="merch">Merch</option>
                </select>
                ${this.renderInput("tags", "Tags (separate by comma)", "text")}
                ${this.renderInput("authors", "Authors (separate by comma)", "text")}
                <label for="images">Images</label>
                <input required id="images" name="images" type="file" accept="image/*" multiple />
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
                ${this.renderInput("thumbnail", "Thumbnail", "url", this.product.thumbnail)}
                ${this.renderInput("url", "URL", "url", this.product.url)}
                ${this.renderInput("tags", "Tags (separate by comma)", "text", this.product.tags.map(tag => tag.tag).join(", "))}
                ${this.renderInput("authors", "Authors (separate by comma)", "text", this.product.authors.map(author => author.name).join(", "))}
                ${this.renderInput("images", "Images (separate by comma)", "textarea", this.product.images.map(image => image.url).join(", "))}
                <button type="submit">Save</button>
            </form>
        `;
    }

    private renderInput(id: string, placeholder: string, type: InputElementType | "textarea" = "text", value: any = ""): TemplateResult {
        const error: string | undefined = this.errors[id];
        return html`
            <label for="${id}">${placeholder}</label>
            ${type === "textarea"
                ? html`<textarea required id="${id}" name="${id}" placeholder=${placeholder}>${value}</textarea>`
                : html`<input required id="${id}" name="${id}" type="${type}" step="0.01" placeholder=${placeholder} value=${value} />`}
            ${error ? html`<span>${error}</span>` : nothing}
        `;
    }

    private changeRoute(route: RouterPage, options?: { searchParams?: Record<string, any> }): void {
        const params = options?.searchParams ? new URLSearchParams(options.searchParams).toString() : "";
        const url = params ? `#${route}?${params}` : `#${route}`;
        window.location.href = url;
    }

    public override async connectedCallback(): Promise<void> {
        super.connectedCallback();
        await this.updateProducts();

        const searchParams = new URLSearchParams(location.search);
        const id = Number(searchParams.get("id"));
        if (id && !isNaN(id)) {
            const product = await this.adminPanelService.getProduct(id);
            if (product) {
                this.loading = false;
                this.product = product;
            }
        }
    }

    private async updateProducts(): Promise<void> {
        const { products, page, pages, limit } = (await this.adminPanelService.getProducts(this.page, this.limit)) ?? { products: [], page: 1, pages: 1, limit: 10 };
        this.products = products;
        this.page = page;
        this.pages = pages;
        this.limit = limit;
    }

    private onLimitChange(event: Event): void {
        const target = event.target as HTMLInputElement;
        const limit = parseInt(target.value, 10);

        if (limit <= 0 || isNaN(limit)) this.limit = 10;
        else this.limit = limit;

        void this.updateProducts();
    }

    private editPage(id: number): void {
        this.changeRoute(RouterPage.AdminEditProductPage, { searchParams: { id } });
    }

    private async deleteProduct(id: number): Promise<void> {
        const confirmation = confirm("Are you sure you want to delete this product?");
        if (!confirmation) return;

        await this.adminPanelService.deleteProduct(id);
        await this.updateProducts();
    }

    private async previousPage(): Promise<void> {
        if (this.page > 1) {
            this.page -= 1;
            await this.updateProducts();
        }
    }

    private async nextPage(): Promise<void> {
        if (this.page < this.pages) {
            this.page += 1;
            await this.updateProducts();
        }
    }

    private async onSubmitCreate(event: SubmitEvent): Promise<void> {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);
        const data = [...formData.entries()].reduce<Record<string, any>>((prev, curr) => {
            const existing = prev[curr[0]];
            return {
                ...prev,
                [curr[0]]: existing ? [...(Array.isArray(existing) ? existing : [existing]), curr[1]] : curr[1],
            };
        }, {});
    
        try {
            this.errors = {};
    
            const thumbnailFile = data.thumbnail as File;
            const imagesFiles = data.images as File[];
    
            const thumbnailBase64 = await this.readFileAsDataURL(thumbnailFile);
            const imagesBase64 = await Promise.all(imagesFiles.map((file) => this.readFileAsDataURL(file)));
    
            const thumbnailUrl = await this.adminPanelService.uploadFile(thumbnailFile.name, thumbnailBase64);
            const imagesUrls = await Promise.all(imagesFiles.map((file, index) => 
                this.adminPanelService.uploadFile(`image_${index}_${file.name}`, imagesBase64[index])
            ));
    
            const parsed = CreateProductFormModelSchema.parse({
                ...data,
                title: data.title,
                price: Number(data.price),
                authors: (data.authors as string).split(",").map((author: string) => ({ name: author.trim() })),
                tags: (data.tags as string).split(",").map((tag: string) => ({ tag: tag.trim() })),
                images: imagesUrls.map((url) => ({ url })),
                thumbnail: thumbnailUrl,
                url: data.url,
                type: data.type
            });
    
            const { errors, data: resp } = await this.adminPanelService.createProduct(parsed);
    
            if (errors.length) {
                this.errors = errors.reduce((prev: Record<string, string>, curr) => {
                    return { ...prev, [curr.field[0]]: curr.message };
                }, {});
                return;
            }
    
            if (resp?.id)
                this.changeRoute(RouterPage.AdminEditProductPage, { searchParams: { id: resp.id } });
        } catch (error) {
            if (error instanceof ZodError) {
                this.errors = error.errors.reduce((prev: Record<string, string>, curr) => {
                    return { ...prev, [curr.path[0]]: curr.message };
                }, {});
    
                console.error(this.errors);
                return;
            }
    
            console.error("[Admin Product Create]: Internal error", error);
            alert("An internal error occurred. Please try again later.");
        }
    }

    private async onSubmitEdit(event: SubmitEvent): Promise<void> {
        if (!this.product) return;

        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            this.errors = {};
            const thumbnailFile = data.thumbnail as File;
            const imagesFiles = data.images as unknown as File[];

            const thumbnailBase64 = await this.readFileAsDataURL(thumbnailFile);
            const imagesBase64 = await Promise.all(imagesFiles.map((file) => this.readFileAsDataURL(file)));

            const thumbnailUrl = await this.adminPanelService.uploadFile(thumbnailFile.name, thumbnailBase64);
            const imagesUrls = await Promise.all(imagesFiles.map((file, index) =>
                this.adminPanelService.uploadFile(`image_${index}_${file.name}`, imagesBase64[index])
            ));

            const parsed = CreateProductFormModelSchema.parse({
                ...data,
                title: data.title,
                price: Number(data.price),
                authors: (data.authors as string).split(",").map((author: string) => ({ name: author.trim() })),
                tags: (data.tags as string).split(",").map((tag: string) => ({ tag: tag.trim() })),
                images: imagesUrls.map((url) => ({ url })),
                thumbnail: thumbnailUrl,
                url: data.url,
                type: data.type
            });

            const errors = await this.adminPanelService.updateProduct(this.product.id, {
                ...parsed,
                id: this.product.id,
            } as unknown as Product);

            if (errors.length) {
                this.errors = errors.reduce((prev: Record<string, string>, curr: { field: any[]; message: any; }) => {
                    return { ...prev, [curr.field[0]]: curr.message };
                }, {});
                return;
            }

            this.changeRoute(RouterPage.AdminOverviewPage);
        } catch (error) {
            if (error instanceof ZodError) {
                this.errors = error.errors.reduce((prev: Record<string, string>, curr) => {
                    return { ...prev, [curr.path[0]]: curr.message };
                }, {});

                console.error(this.errors);
                return;
            }

            console.error("[Admin Product Edit]: Internal error", error);
            alert("An internal error occurred. Please try again later.");
        }
    }
    
    private async readFileAsDataURL(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === "string") {
                    resolve(reader.result);
                } else {
                    reject(new Error("Failed to read file as data URL."));
                }
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }
}
