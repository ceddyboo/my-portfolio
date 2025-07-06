# Client Page Template Documentation

This is a reusable Next.js client page template with dynamic content loading, smooth animations, and responsive design.

## Features

### 🎯 Hero Section
- **Large client name** with gradient text effect
- **Dark background image** with heavy black gradient overlay for text readability
- **Subscriber count** displayed prominently
- **Category badge** with glassmorphism effect
- **Animated scroll indicator**

### 🔄 Toggle Switch
- **Smooth animations** with Framer Motion
- **Two options**: "Video Editing" and "Thumbnail Design"
- **Responsive design** with hover effects
- **Layout animations** for seamless transitions

### 📹 Video Grid (3x3)
- **Responsive grid**: 1 column on mobile, 2 on tablet, 3 on desktop
- **YouTube embeds** with lazy loading
- **Hover effects** with scale animations
- **Loading indicators** and error handling
- **Staggered entrance animations**

### 🖼️ Thumbnail Grid (4x4)
- **Responsive grid**: 2 columns on mobile, 3 on tablet, 4 on desktop
- **1920x1080 images** with aspect ratio preservation
- **Lazy loading** for performance
- **Fallback placeholders** for missing images
- **Hover effects** with overlay and icon

## File Structure

```
app/work/[client]/
├── page.tsx                 # Main client page component
lib/
├── clientData.ts           # Client data management
public/
├── images/                 # Background images
│   ├── cole-background.jpg
│   └── default-background.jpg
└── thumbnails/            # Thumbnail images
    ├── cole-1.jpg
    ├── cole-2.jpg
    └── ...
```

## How to Add a New Client

### 1. Add Client Data
Edit `lib/clientData.ts` and add a new client entry:

```typescript
export const clientDatabase: Record<string, ClientData> = {
  // Existing clients...
  
  newclient: {
    name: "New Client Name",
    subscribers: "5.2M",
    backgroundImage: "/images/newclient-background.jpg",
    videos: [
      "https://www.youtube.com/embed/video1?start=30",
      "https://www.youtube.com/embed/video2?start=45",
      // Add up to 9 videos for 3x3 grid
    ],
    thumbnails: [
      "/thumbnails/newclient-1.jpg",
      "/thumbnails/newclient-2.jpg",
      // Add up to 16 thumbnails for 4x4 grid
    ],
    category: "Content Category",
    description: "Optional description"
  },
};
```

### 2. Add Images
- **Background image**: Add to `public/images/` (recommended: 1920x1080 or larger)
- **Thumbnails**: Add to `public/thumbnails/` (recommended: 1920x1080)

### 3. Access the Page
Navigate to `/work/newclient` to view the new client page.

## API Integration

To integrate with a real API, replace the `getClientData` function in `lib/clientData.ts`:

```typescript
export const getClientData = async (clientSlug: string): Promise<ClientData> => {
  try {
    const response = await fetch(`/api/clients/${clientSlug}`);
    if (!response.ok) throw new Error('Client not found');
    return await response.json();
  } catch (error) {
    return {
      name: "Unknown Client",
      subscribers: "0",
      backgroundImage: "/images/default-background.jpg",
      videos: [],
      thumbnails: [],
      category: "Unknown",
      description: "Client not found."
    };
  }
};
```

## Performance Optimizations

### Lazy Loading
- **Images**: All images use `loading="lazy"`
- **Videos**: YouTube embeds are lazy loaded
- **Components**: Intersection Observer triggers animations

### Error Handling
- **Image fallbacks**: Placeholder images for missing thumbnails
- **Video fallbacks**: Error handling for broken embeds
- **Loading states**: Spinner while data loads

### Animation Performance
- **Reduced motion**: Respects user preferences
- **Hardware acceleration**: Uses transform properties
- **Optimized triggers**: Efficient intersection observer settings

## Customization

### Styling
All styling uses Tailwind CSS classes. Key customization points:

- **Colors**: Purple/blue gradient theme (easily changeable)
- **Spacing**: Consistent padding and margins
- **Typography**: Responsive text sizes
- **Animations**: Configurable durations and easing

### Layout
- **Grid systems**: Responsive breakpoints
- **Aspect ratios**: 16:9 for videos and thumbnails
- **Container widths**: Max-width constraints for large screens

## Browser Support

- **Modern browsers**: Full support with all animations
- **Older browsers**: Graceful degradation
- **Mobile**: Optimized touch interactions
- **Accessibility**: ARIA labels and keyboard navigation

## Dependencies

- **Next.js 14**: App Router
- **React 18**: Hooks and state management
- **Framer Motion**: Animations and transitions
- **Tailwind CSS**: Styling and responsive design
- **Lucide React**: Icons
- **React Intersection Observer**: Scroll-based animations

## Usage Example

```typescript
// Navigate to a client page
// URL: /work/cole
// This will load Cole the Cornstar's data and display the page

// The page automatically:
// 1. Loads client data based on the URL parameter
// 2. Displays the hero section with background image
// 3. Shows the toggle switch for videos/thumbnails
// 4. Renders the appropriate grid based on selection
```

## Troubleshooting

### Common Issues

1. **Images not loading**: Check file paths in `public/` directory
2. **Videos not embedding**: Verify YouTube embed URLs are correct
3. **Animations not working**: Ensure Framer Motion is installed
4. **Layout breaking**: Check Tailwind CSS is properly configured

### Performance Tips

1. **Optimize images**: Use WebP format and appropriate sizes
2. **Limit videos**: Keep to 9 videos maximum for best performance
3. **Compress thumbnails**: Use 1920x1080 but optimize file size
4. **CDN hosting**: Host images on a CDN for faster loading 