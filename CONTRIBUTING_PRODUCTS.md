# Contributing Products to Openomy Showcase

Welcome to the Openomy Product Showcase! This guide will help you add your product to our community showcase.

## How to Add Your Product

### 1. Fork the Repository
- Fork the [Openomy repository](https://github.com/openomy/openomy) to your GitHub account
- Clone your fork locally

### 2. Edit the Products File
- Navigate to `apps/web/public/products/products.json`
- Add your product entry to the `products` array

### 3. Product Entry Format

```json
{
  "id": "unique-product-id",
  "productName": "Your Product Name",
  "label": "Category Label",
  "description": "A compelling description of your product (100-200 characters recommended)",
  "image": {
    "src": "https://your-image-url.com/image.jpg",
    "alt": "Description of the image",
    "width": 800,
    "height": 600
  },
  "category": "category-id",
  "links": {
    "website": "https://your-website.com",
    "github": "https://github.com/your-repo",
  },
  "contributor": {
    "githubUsername": "your-github-username",
    "addedDate": "YYYY-MM-DD"
  },
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
}
```

## Field Guidelines

### Required Fields
- **id**: Unique identifier (lowercase, hyphens for spaces, e.g., "my-awesome-product")
- **productName**: Your product's display name
- **description**: Brief description (keep it engaging and informative)
- **image**: Product image or screenshot
- **category**: Choose from existing categories or propose a new one
- **contributor**: Your GitHub username and the current date

### Optional Fields
- **label**: Short category or type label (e.g., "Gaming", "AI Tool", "Framework")
- **links**: At least one link recommended (website or GitHub)
- **tags**: 3-5 relevant tags for searchability

## Available Categories

Current categories (use the string in your product `category` field):
- `gaming` - Games and gaming platforms
- `developer-tools` - Tools for developers
- `ui-framework` - UI frameworks and libraries
- `ai-application` - AI-powered applications
- `build-tools` - Build and bundling tools
- `admin-template` - Admin dashboard templates
- `data-visualization` - Data visualization libraries
You may propose a new category by choosing a sensible string. Maintainers may align naming during review.

## Image Requirements

### Image Sources
You can use:
1. **External URLs**: Direct links to images hosted elsewhere
   - Use services like Unsplash, Cloudinary, or your own CDN
   - Example: `https://images.unsplash.com/photo-...`
   - Note: Remote images are rendered in an unoptimized mode by default. Prefer ≤ 500KB files.

2. **Local Images (recommended)**: Place under `/apps/web/public/products/<your-id>/`
   - Reference with: `/products/<your-id>/<filename>.png`
   - Supported formats: PNG, JPG, SVG, WEBP

### Image Guidelines
- **Recommended size**: 800x600px or 16:9 aspect ratio
- **File size**: Keep under 500KB for optimal loading
- **Quality**: Use high-quality screenshots or product images
- **Content**: Show your product's main interface or key feature

## Tags Best Practices

Choose tags that help users find your product:
- Technology stack (e.g., "react", "vue", "typescript")
- Category descriptors (e.g., "open-source", "blockchain", "ai")
- Use case (e.g., "productivity", "gaming", "visualization")
- Keep tags lowercase
- Limit to 5 tags maximum

## Example Entry

```json
{
  "id": "my-awesome-app",
  "productName": "My Awesome App",
  "label": "Productivity",
  "description": "A revolutionary productivity app that helps developers manage their time and tasks efficiently with AI-powered insights.",
  "image": {
    "src": "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
    "alt": "My Awesome App Dashboard",
    "width": 800,
    "height": 600
  },
  "category": "developer-tools",
  "links": {
    "website": "https://myawesomeapp.com",
    "github": "https://github.com/username/my-awesome-app"
  },
  "contributor": {
    "githubUsername": "yourusername",
    "addedDate": "2025-01-28"
  },
  "tags": ["productivity", "ai", "typescript", "open-source", "developer-tools"]
}
```

## Validation Checklist

Before submitting your PR, ensure:
- [ ] Product ID is unique (check existing products)
- [ ] All required fields are filled
- [ ] Image URL is accessible and loads properly
- [ ] Category ID matches an existing category
- [ ] Date format is YYYY-MM-DD
- [ ] JSON syntax is valid (use a JSON validator)
- [ ] Description is clear and concise
- [ ] At least one link is provided

## Submitting Your Product

1. **Commit your changes**
   ```bash
   git add apps/web/public/products/products.json
   git commit -m "Add [Your Product Name] to showcase"
   ```

2. **Push to your fork**
   ```bash
   git push origin main
   ```

3. **Create a Pull Request**
   - Go to the original Openomy repository
   - Click "New Pull Request"
   - Select your fork and branch
   - Add a clear title: "Add [Product Name] to showcase"
   - Submit the PR

## Review Process

- PRs are typically reviewed within 2-3 days
- Ensure your product is legitimate and functional
- We may suggest improvements to descriptions or images
- Once approved, your product will appear in the showcase!

## Need Help?

- Check existing products in `products.json` for examples
- Open an issue if you encounter problems
- Join our community discussions for support

## Tips for a Great Submission

1. **Write compelling descriptions**: Focus on what makes your product unique
2. **Use high-quality images**: First impressions matter
3. **Choose accurate categories**: Helps users find your product
4. **Add relevant tags**: Improves discoverability
5. **Include links**: Let users explore your product further

Thank you for contributing to the Openomy Product Showcase! 🚀
