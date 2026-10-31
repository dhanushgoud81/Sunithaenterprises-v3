import React, { useEffect } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import UPVCProductDetail from './components/UPVCProductDetail';
import { PageWrapper } from './components/Shared';
import { PRODUCT_SLUGS, slugForProduct } from './data/products';

/** /products/:slug — gives every window type a real, shareable URL. */
export default function ProductPage() {
  const { slug = '' } = useParams();
  const navigate = useNavigate();
  const productName = PRODUCT_SLUGS[slug];

  useEffect(() => {
    if (productName) document.title = `uPVC ${productName} | Sunitha Enterprises`;
  }, [productName]);

  if (!productName) return <Navigate to="/#upvc-types" replace />;

  return (
    <PageWrapper>
      <UPVCProductDetail
        productName={productName}
        onBack={() => navigate('/#upvc-types')}
        onSelectProduct={(name) => navigate(`/products/${slugForProduct(name)}`)}
      />
    </PageWrapper>
  );
}
