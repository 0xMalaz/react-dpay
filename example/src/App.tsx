import React from "react";
import { Diamond, Package, Sparkles } from "lucide-react";
import { DpayProvider, useDpay } from "react-dpay-modal";
import "./styles.css";

const PricingCard = ({
  title,
  dpayid,
  price,
  features,
  dpayModal,
  icon: Icon,
  description,
}) => {
  const handleOpenModal = () => {
    dpayModal.setProduct({
      productName: title,
      productDescription: description,
      price: parseFloat(price.replace(/[^0-9.-]+/g, "")),
      dpayid,
    });
    dpayModal.open();
  };

  return (
    <div className="card">
      <div>
        {Icon && <Icon className="icon" />}
        <h3 className="card-title">{title}</h3>
        <p className="card-price">{price}</p>
        <ul className="card-features">
          {features.map((feature, index) => (
            <li key={index} className="feature-item">
              <svg
                className="feature-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              {feature}
            </li>
          ))}
        </ul>
      </div>
      <button className="button" onClick={handleOpenModal}>
        Get Started
      </button>
    </div>
  );
};

const PricingPage = () => {
  const dpayModal = useDpay();

  const pricingOptions = [
    {
      title: "Starter",
      dpayid: "f6d6c91d-5d18-47c2-a6dc-97fca645dc2b",
      price: "$9/mo",
      features: [
        "Basic Crypto Payments",
        "50 Transactions/Month",
        "Email Support",
        "Standard Analytics",
      ],
      description: "A basic plan for starters.",
      icon: Package,
    },
    {
      title: "Pro",
      dpayid: "f6d6c91d-5d18-47c2-a6dc-97fca645dc2b",
      price: "$29/mo",
      features: [
        "Advanced Crypto Payments",
        "Unlimited Transactions",
        "Priority Support",
        "Advanced Analytics",
        "Customizable Checkout",
      ],
      description: "A pro plan for professionals.",
      icon: Sparkles,
    },
    {
      title: "Enterprise",
      dpayid: "f6d6c91d-5d18-47c2-a6dc-97fca645dc2b",
      price: "$99/mo",
      features: [
        "Enterprise Crypto Payments",
        "Dedicated Account Manager",
        "24/7 Premium Support",
        "Custom Integrations",
        "High-Volume Processing",
      ],
      description: "An enterprise plan for big companies.",
      icon: Diamond,
    },
  ];

  return (
    <div className="page">
      <div className="page-container">
        <h1 className="page-title">Choose Your Plan</h1>
        <div className="card-grid">
          {pricingOptions.map((option, index) => (
            <PricingCard
              key={index}
              dpayid={option.dpayid}
              title={option.title}
              price={option.price}
              features={option.features}
              dpayModal={dpayModal}
              icon={option.icon}
              description={option.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <DpayProvider apiKey="7O5zukZpwrdrMfMu87Mn7YSJ12xDNLa8Jbjd2Nsq+cOnB0Kfe7agGoXfo44R639S+I76tGMXGQl7RSM098DMr/lAc4t2mESt6ctYtU7sa3blB7D8H4aG6qAhoUm4xXt0">
      <PricingPage />
    </DpayProvider>
  );
}

export default App;
