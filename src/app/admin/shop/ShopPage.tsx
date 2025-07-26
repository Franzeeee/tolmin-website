'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'
import axios from 'axios'
import Loading from '@/components/Loading'

interface Product {
  id: number
  name: string
  price: number
  img: string
}

export default function ShopPage() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [products, setProducts] = useState<Product[]>([])
    const [selectedProductId, setSelectedProductId] = useState<number | null>(null)
    const [editedName, setEditedName] = useState('')
    const [editedPrice, setEditedPrice] = useState('')
    const [newName, setNewName] = useState('')
    const [newPrice, setNewPrice] = useState('')
    const [newImage, setNewImage] = useState<string>('/Merch/item1.png')
    const [uploadedImage, setUploadedImage] = useState<File | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Fetch products from API
        fetchProducts()
    }, [])
    
        const fetchProducts = async () => {
            setIsLoading(true)
            try {
                const response = await axios.get('/api/products')
                setProducts(
                  response.data.map((item: Product & { _id?: number }) => ({
                    id: item.id ?? item._id,
                    name: item.name,
                    price: item.price,
                    img: item.img,
                  }))
                )
            } catch (error) {
                console.error('Error fetching products:', error)
            } finally {
                setIsLoading(false)
            }
        }

const handleEdit = (product: Product) => {
    setSelectedProductId(product.id)
    setEditedName(product.name)
    setEditedPrice(product.price.toString())
    setIsModalOpen(true)
}

const handleSave = async () => {
    if (selectedProductId === null) return

    try {
        // Update product in backend
        await axios.put(`/api/products/${selectedProductId}`, {
            name: editedName,
            price: Number(editedPrice),
        })

        setProducts(prev =>
            prev.map(product =>
                product.id === selectedProductId
                    ? { ...product, name: editedName, price: Number(editedPrice) }
                    : product
            )
        )
        setIsModalOpen(false)
        setSelectedProductId(null)
        Swal.fire({
            icon: 'success',
            title: 'Updated!',
            text: 'Merch item has been successfully updated.',
            confirmButtonColor: '#2563EB'
        })
    } catch (error: unknown) {
        let errorMessage = 'Failed to update product.';
        if (typeof error === 'object' && error !== null && 'response' in error) {
            const err = error as { response?: { data?: { message?: string } } };
            errorMessage = err.response?.data?.message || errorMessage;
        }
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: errorMessage,
            confirmButtonColor: '#2563EB'
        })
    } finally {
        fetchProducts()
    }

}

//   const handleSave = () => {
//     if (selectedProductId === null) return

//     setProducts(prev =>
//       prev.map(product =>
//         product.id === selectedProductId
//           ? { ...product, name: editedName, price: Number(editedPrice) }
//           : product
//       )
//     )
//     setIsModalOpen(false)
//     setSelectedProductId(null)
//     Swal.fire({
//       icon: 'success',
//       title: 'Updated!',
//       text: 'Merch item has been successfully updated.',
//       confirmButtonColor: '#2563EB'
//     })
//   }

  const handleAddProduct = async () => {
    if (!newName || !newPrice) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing fields',
        text: 'Please fill in all fields.',
        confirmButtonColor: '#2563EB'
      })
      return
    }

    const newProduct: Product = {
      id: products.length + 1,
      name: newName,
      price: Number(newPrice),
      img: newImage,
    }

    setProducts(prev => [...prev, newProduct])
    setIsAddModalOpen(false)
    setNewName('')
    setNewPrice('')
    setNewImage('/Merch/item1.png')

    // Upload the image to cloudinary first
    const uploadResponse = await axios.post('/api/upload', {
        file: uploadedImage,
    } , {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    newProduct.img = uploadResponse.data.url;


    // Call API to add product (example using fetch)
    fetch('/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newProduct)
    }).then(async (res) => {
      if (!res.ok) {
        const error = await res.json();
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Failed to add product.',
          confirmButtonColor: '#2563EB'
        });
      } else {
        Swal.fire({
          icon: 'success',
          title: 'Product Added!',
          text: 'New merch item has been added.',
          confirmButtonColor: '#2563EB'
        });
        fetchProducts()
      }
    }).catch(() => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to add product.',
        confirmButtonColor: '#2563EB'
      });
    });
  }

  const handleDelete = (id: number) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DC2626',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Delete'
    }).then(result => {
      if (result.isConfirmed) {
        setProducts(prev => prev.filter(product => product.id !== id))
        // Call API to delete product
        axios.delete(`/api/products/${id}`)
          .then(() => {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'Merch item has been successfully deleted.',
              confirmButtonColor: '#2563EB'
            })
          })
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Welcome & Stats */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Welcome to Shop Page! 👋</h1>
        <p className="text-gray-600 mt-1">
          This is the admin section where you can manage your club&#39;s merchandise, view sales statistics, and handle customer inquiries.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-semibold text-gray-500">Total Products</h3>
          <p className="mt-2 text-2xl font-bold text-gray-800">{products.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-semibold text-gray-500">Orders</h3>
          <p className="mt-2 text-2xl font-bold text-gray-800">56</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-semibold text-gray-500">Revenue</h3>
          <p className="mt-2 text-2xl font-bold text-gray-800">€1,200</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-semibold text-gray-500">Customer Inquiries</h3>
          <p className="mt-2 text-2xl font-bold text-gray-800">5</p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="flex items-center justify-between lg:mb-8">
        <h2 className="text-2xl font-semibold text-gray-700">Products</h2>
        <button
          className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium shadow hover:bg-red-700 transition"
          onClick={() => setIsAddModalOpen(true)}
        >
          Add Product
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        { products.length > 0 ? (
          products.map(product => (
            <div
              key={product.id}
              className="bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-lg p-6 flex flex-col items-center transition-transform hover:scale-100 hover:shadow-xl"
            >
              <div className="relative w-28 h-28 mb-4">
                <Image
                  src={product.img}
                  alt={product.name}
                  fill
                  className="object-contain rounded-lg shadow"
                  sizes="112px"
                  priority
                />
              </div>
              <h3 className="font-semibold text-gray-900 text-lg mb-1 text-center">{product.name}</h3>
              <p className="text-red-700 font-bold text-base mb-2 text-center">€{product.price}.00</p>
              <button
                onClick={() => handleEdit(product)}
                className="mt-auto bg-red-600 text-white px-6 py-2 rounded-lg font-medium shadow hover:bg-red-700 transition w-full cursor-pointer"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(product.id)}
                className="mt-2 bg-gray-600 text-white px-6 py-2 rounded-lg font-medium shadow hover:bg-gray-700 transition w-full cursor-pointer"
              >
                Delete
              </button>
            </div>
          ))
        ) : (
            <div className="col-span-3 text-center text-gray-500">
                {isLoading ? <Loading /> : 'No products available.'}
            </div>
        )}
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 text-black">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">Edit Product</h3>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Product Name</label>
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Price (€)</label>
              <input
                type="number"
                value={editedPrice}
                onChange={(e) => setEditedPrice(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
                onClick={() => {
                  setIsModalOpen(false)
                  setSelectedProductId(null)
                }}
              >
                Cancel
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                onClick={handleSave}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 text-black">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">Add Product</h3>

            {/* Product Image */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-1">Product Image</label>
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20 border rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <Image
                    src={newImage}
                    alt="Preview"
                    fill
                    className="object-contain"
                  />
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-red-700 hover:file:bg-blue-100"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    setUploadedImage(file || null);
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        if (typeof ev.target?.result === 'string') {
                          setNewImage(ev.target.result);
                        }
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Upload an image above. Supported formats: JPG, PNG, GIF.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Product Name</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Price (€)</label>
              <input
                type="number"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
                onClick={() => setIsAddModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                onClick={handleAddProduct}
              >
                Add Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
