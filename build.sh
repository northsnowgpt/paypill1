#!/bin/bash
echo "🏥 PayPill Build Script"
echo "========================"
echo ""
echo "Step 1: Installing dependencies..."
npm install
echo ""
echo "Step 2: Building application..."
npm run build
echo ""
echo "✅ Build complete! Check the 'dist' folder for output."
echo ""
echo "To deploy:"
echo "  - Vercel: vercel --prod"
echo "  - Netlify: netlify deploy --prod --dir=dist"
echo "  - AWS S3: aws s3 sync dist/ s3://your-bucket"
