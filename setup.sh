#!/bin/bash

echo "🚀 Setting up FocusPulse MERN Application..."
echo ""

# Backend setup
echo "📦 Installing backend dependencies..."
cd backend
npm install

if [ ! -f .env ]; then
    echo "📝 Creating backend .env file..."
    cp .env.example .env
    echo "⚠️  Please edit backend/.env with your credentials!"
fi

cd ..

# Frontend setup
echo "📦 Installing frontend dependencies..."
cd frontend
npm install

if [ ! -f .env ]; then
    echo "📝 Creating frontend .env file..."
    cp .env.example .env
fi

cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Make sure MongoDB is running"
echo "2. Edit backend/.env with your MongoDB URI and secrets"
echo "3. Run 'cd backend && npm run dev' in one terminal"
echo "4. Run 'cd frontend && npm start' in another terminal"
echo ""
echo "Happy coding! 🎉"
