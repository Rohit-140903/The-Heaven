
import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../Context/ShopContext";
import { useParams } from "react-router-dom";
import Breadcrum from "../Components/BreadCrums/BreadCrums";
import ProductDisplay from "../Components/ProductDisplay/ProductDisplay";
import DescriptionBox from "../Components/DescriptionBox/DescriptionBox";
import RelatedProducts from "../Components/RelatedProducts/RelatedProducts";

function Product() {
    const { all_product } = useContext(ShopContext);
    const { productId } = useParams();
    const [stockStatus, setStockStatus] = useState(null);
    const [loading, setLoading] = useState(true);

    const product = all_product.find((e) => e.id === Number(productId));

    useEffect(() => {
        const fetchStockStatus = async () => {
            if (!product) {
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/checkStock/${productId}`);
                const data = await response.json();
                if (data.success) {
                    setStockStatus(data.stockStatus);
                } else {
                    console.error("Error fetching stock status:", data.message);
                }
            } catch (error) {
                console.error("Error fetching stock status:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStockStatus();
    }, [productId, product]);

    if (!product) {
        return (
            <div style={{ textAlign: "center", color: "red", fontSize: "18px", marginTop: "20px" }}>
                Product not found.
            </div>
        );
    }

    return (
        <div>
            {loading && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        background: "rgba(0, 0, 0, 0.3)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 1000
                    }}
                >
                    <div
                        style={{
                            width: "50px",
                            height: "50px",
                            border: "4px solid rgba(255, 255, 255, 0.3)",
                            borderTop: "4px solid #fff",
                            borderRadius: "50%",
                            animation: "spin 1s linear infinite"
                        }}
                    ></div>
                    <style>
                        {`
                            @keyframes spin {
                                0% { transform: rotate(0deg); }
                                100% { transform: rotate(360deg); }
                            }
                        `}
                    </style>
                </div>
            )}
            <Breadcrum product={product} />
            <ProductDisplay product={product} stockStatus={stockStatus} />
            <DescriptionBox product={product} />
            <RelatedProducts product={product} />
        </div>
    );
}

export default Product;
