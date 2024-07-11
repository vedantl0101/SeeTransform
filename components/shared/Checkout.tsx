"use client";

import { loadStripe } from "@stripe/stripe-js";
import { useEffect } from "react";

import { useToast } from "@/components/ui/use-toast";
import { checkoutCredits } from "@/lib/actions/transaction.action";

import { Button } from "../ui/button";

const Checkout = ({
  plan,
  amount,
  credits,
  buyerId,
}: {
  plan: string;
  amount: number;
  credits: number;
  buyerId: string;
}) => {
  const { toast } = useToast();

  useEffect(() => {
    loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }, []);

  useEffect(() => {
    // Define the function within useEffect to ensure it has access to the latest 'toast'
    const handleCheckoutFeedback = () => {
      const query = new URLSearchParams(window.location.search);
      if (query.get("success")) {
        toast({
          title: "Order placed!",
          description: "You will receive an email confirmation",
          duration: 5000,
          className: "success-toast",
        });
      }

      if (query.get("canceled")) {
        toast({
          title: "Order canceled!",
          description: "Continue to shop around and checkout when you're ready",
          duration: 5000,
          className: "error-toast",
        });
      }
    };

    handleCheckoutFeedback();  // Call the function immediately

    // Ensure all dependencies are included to prevent unnecessary re-renders
  }, [toast]);

  const onCheckout = async () => {
    const transaction = {
      plan,
      amount,
      credits,
      buyerId,
    };

    await checkoutCredits(transaction);
  };

  return (
    <form onSubmit={onCheckout}>
      <section>
        <Button
          type="submit"
          role="button"
          className="w-full rounded-full bg-purple-gradient bg-cover"
        >
          Buy Credit
        </Button>
      </section>
    </form>
  );
};

export default Checkout;
