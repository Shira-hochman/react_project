import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  buyCount: number;
}

interface Review {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  comment: string;
}

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // קריאה למוצר
        const productResponse = await axios.get<Product>(`http://localhost:3001/products/${id}`);
        setProduct(productResponse.data);

        // קריאה לחוות דעת
        const reviewsResponse = await axios.get<Review[]>(`http://localhost:3001/reviews?productId=${id}`);
        setReviews(reviewsResponse.data);
      } catch (err) {
        setError("אירעה שגיאה בעת טעינת הנתונים");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <div>טוען...</div>;
  if (error) return <div>{error}</div>;
  if (!product) return <div>המוצר לא נמצא</div>;

  return (
    <div className="container mt-4">
      <h2>{product.name}</h2>
      <img src={product.image} alt={product.name} style={{ maxWidth: "300px" }} />
      <p>{product.description}</p>
      <p>קטגוריה: {product.category}</p>
      <p>מחיר: ₪{product.price}</p>
      <p>מספר רכישות: {product.buyCount}</p>

      <h3 className="mt-4">חוות דעת</h3>
      {reviews.length === 0 ? (
        <p>אין חוות דעת עדיין.</p>
      ) : (
        reviews.map((review) => (
          <div key={review.id} className="border p-2 my-2">
            <p>דירוג: {review.rating} כוכבים</p>
            <p>תגובה: {review.comment}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default ProductDetails;
