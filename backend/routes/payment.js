const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/payment/create-checkout-session
// @desc    Create Stripe checkout session for premium upgrade
// @access  Private
router.post('/create-checkout-session', protect, async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'FocusPulse Premium',
              description: 'Unlock unlimited sessions, advanced analytics, and priority support'
            },
            unit_amount: 999, // $9.99
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `http://localhost:3000/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:3000/dashboard`,
      client_reference_id: req.user._id.toString(),
    });

    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/payment/verify-session
// @desc    Verify payment and upgrade user to premium
// @access  Private
router.post('/verify-session', protect, async (req, res) => {
  try {
    const { sessionId } = req.body;

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid') {
      // Upgrade user to premium
      req.user.isPremium = true;
      req.user.premiumExpiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year
      await req.user.save();

      res.json({
        success: true,
        message: 'Successfully upgraded to premium!',
        user: {
          _id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          isPremium: req.user.isPremium,
          premiumExpiresAt: req.user.premiumExpiresAt
        }
      });
    } else {
      res.status(400).json({ message: 'Payment not completed' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/payment/premium-status
// @desc    Check premium status
// @access  Private
router.get('/premium-status', protect, async (req, res) => {
  try {
    res.json({
      isPremium: req.user.isPremium,
      premiumExpiresAt: req.user.premiumExpiresAt
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
