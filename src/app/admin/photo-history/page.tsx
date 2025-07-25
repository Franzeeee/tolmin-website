'use client';

import { useEffect, useState } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import {
    SortableContext,
    useSortable,
    arrayMove,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGripVertical, faTrash, faPlus, faCheckCircle, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import { v4 as uuidv4 } from 'uuid';
import RichTextEditor from '@/components/RichTextEditor';
import Swal from 'sweetalert2';
import { useImageUpload } from '@/app/hooks/useImageUpload';
import { useFetchPhotoHistory } from '@/app/hooks/useFetchPhotoHistory';

interface PhotoCard {
    id: string;
    year: string;
    description: string;
    images: File[];
    imagePreviews: string[];
    saved?: boolean;
    sequence: number;
}

function SortableCard({
    card,
    onChange,
    onDelete,
    onSave,
}: {
    card: PhotoCard;
    onChange: (id: string, field: keyof PhotoCard, value: string | string[] | File[] | number) => void;
    onDelete: (id: string) => void;
    onSave: (id: string) => void;
}) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: card.id });
    const style = { transform: CSS.Transform.toString(transform), transition };

    const canSave =
        card.year.trim() !== '' &&
        card.description.trim() !== '' &&
        card.images.length > 0 &&
        !card.saved;

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            className="bg-white shadow-md p-6 rounded-lg space-y-4 text-black"
        >
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faGripVertical} {...listeners} className="cursor-grab text-gray-500" />
                    <span className="text-xs text-gray-400 mr-2">#{card.sequence + 1}</span>
                    {card.saved ? (
                        <span className="font-semibold">{card.year}</span>
                    ) : (
                        <input
                            type="text"
                            value={card.year}
                            onChange={(e) => onChange(card.id, 'year', e.target.value)}
                            placeholder="Year"
                            className="border border-gray-300 rounded px-3 py-2 w-full"
                            disabled={card.saved}
                        />
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {card.saved && (
                        <span className="text-green-600 flex items-center gap-1">
                            <FontAwesomeIcon icon={faCheckCircle} /> Saved
                        </span>
                    )}
                    {card.saved && (
                        <button
                            onClick={() => onDelete(card.id)}
                            className="text-red-500 hover:text-red-700"
                            type="button"
                        >
                            <FontAwesomeIcon icon={faTrash} />
                        </button>
                    )}
                </div>
            </div>

            {card.saved ? (
                <div
                    className="prose"
                    dangerouslySetInnerHTML={{ __html: card.description }}
                />
            ) : (
                <RichTextEditor
                    content={card.description}
                    onEditorChange={(html) => onChange(card.id, 'description', html)}
                />
            )}

            <div className="flex flex-wrap gap-3">
                {card.imagePreviews.map((preview, i) => (
                    <div key={i} className="relative w-52 h-52">
                        <Image
                            src={preview}
                            alt={`Preview ${i}`}
                            width={128}
                            height={128}
                            className="rounded border object-cover w-full h-full"
                        />
                        {!card.saved && (
                            <button
                                type="button"
                                className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center hover:bg-red-700"
                                onClick={() => {
                                    const newImages = [...card.images];
                                    const newPreviews = [...card.imagePreviews];
                                    newImages.splice(i, 1);
                                    newPreviews.splice(i, 1);
                                    onChange(card.id, 'images', newImages);
                                    onChange(card.id, 'imagePreviews', newPreviews);
                                }}
                            >
                                &times;
                            </button>
                        )}
                    </div>
                ))}

                {!card.saved && (
                    <label className="flex items-center justify-center w-52 h-52 border-2 border-dashed border-gray-300 rounded cursor-pointer hover:border-red-500 transition-colors">
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                                if (e.target.files) {
                                    const filesArray = Array.from(e.target.files);
                                    const newPreviews = filesArray.map(file => URL.createObjectURL(file));
                                    onChange(card.id, 'images', [...card.images, ...filesArray]);
                                    onChange(card.id, 'imagePreviews', [...card.imagePreviews, ...newPreviews]);
                                }
                            }}
                            disabled={card.saved}
                        />
                        <FontAwesomeIcon icon={faPlus} className="text-gray-400" />
                    </label>
                )}
            </div>

            {!card.saved && (
                <div className="flex justify-end">
                    <button
                        type="button"
                        className={`inline-flex items-center px-4 py-2 rounded transition duration-200 ${
                            canSave
                                ? 'bg-green-600 text-white hover:bg-green-700'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                        onClick={() => onSave(card.id)}
                        disabled={!canSave}
                    >
                        <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                        Save
                    </button>
                </div>
            )}
        </div>
    );
}


export default function PhotoHistoryDashboard() {
    const [cards, setCards] = useState<PhotoCard[]>([]);
    const { upload } = useImageUpload();

    const updateSequences = (cards: PhotoCard[]) =>
        cards.map((c, idx) => ({ ...c, sequence: idx }));

    const addCard = () =>
        setCards((prev) =>
            updateSequences([
                ...prev,
                { id: uuidv4(), year: '', description: '', images: [], imagePreviews: [], saved: false, sequence: prev.length },
            ])
        );

    const updateCard = (
        id: string,
        field: keyof PhotoCard,
        value: string | string[] | File[] | number
    ) => {
        setCards((prev) =>
            prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
        );
    };

    const deleteCard = (id: string) =>
        setCards((prev) => updateSequences(prev.filter((c) => c.id !== id)));

    const saveCard = (id: string) => {
        setCards((prev) =>
            prev.map((c) =>
                c.id === id ? { ...c, saved: true } : c
            )
        );
    };

    const handleSubmitAll = async () => {
        const preparedData = cards.map((card) => ({
            year: card.year,
            description: card.description,
            sequence: card.sequence,
            images: card.images.map((file) => file.name),
            imagePreviews: card.imagePreviews,
        }));

        console.log('Submitting data:', preparedData);

        Swal.fire({
            title: 'Saving Photo History',
            text: 'Please wait while we save your changes.',
            showConfirmButton: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });
        try {

            // Upload all images using the original cards array, not preparedData
            // Collect all files that are not already uploaded (i.e., not Cloudinary URLs)
            const uploadTasks: { cardIdx: number; fileIdx: number; file: File }[] = [];
            cards.forEach((card, cardIdx) => {
                card.images.forEach((file, fileIdx) => {
                    const preview = card.imagePreviews[fileIdx];
                    // If preview is not a Cloudinary URL, we need to upload
                    if (!/^https?:\/\/res\.cloudinary\.com\//.test(preview)) {
                        uploadTasks.push({ cardIdx, fileIdx, file });
                    }
                });
            });

            // Upload only new images
            const uploadedUrls = await Promise.all(
                uploadTasks.map(({ file }) => upload(file))
            );

            // Assign uploaded image URLs to imagePreviews for each card
            let uploadIdx = 0;
            preparedData.forEach((card, cardIdx) => {
                const originalCard = cards[cardIdx];
                card.images = originalCard.images.map((file) => file.name);
                card.imagePreviews = originalCard.imagePreviews.map((preview) => {
                    if (/^https?:\/\/res\.cloudinary\.com\//.test(preview)) {
                        // Already a Cloudinary URL, keep as is
                        return preview ?? '';
                    } else {
                        // Replace with uploaded URL
                        const url = uploadedUrls[uploadIdx];
                        uploadIdx++;
                        return url ?? '';
                    }
                });
            });

            const response = await fetch('/api/photo-history', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(preparedData),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to save photo history');
            }

            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: `Photo history saved successfully. Inserted count: ${result.insertedCount}`,
            });

            setCards((prev) => prev.map((c) => ({ ...c, saved: true })));
        } catch (error) {
            console.error('Error saving photo history:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: (error instanceof Error ? error.message : 'An unexpected error occurred.'),
            });
        }
    };

    // Call useFetchPhotoHistory at the top level of the component, not inside useEffect
    const { photoHistory, isLoading } = useFetchPhotoHistory();

    useEffect(() => {
        if (photoHistory.length > 0) {
            interface PhotoHistoryItem {
                _id?: string;
                year: string;
                description: string;
                imagePreviews?: string[];
                sequence?: number;
            }

            const initialCards: PhotoCard[] = photoHistory.map((item: PhotoHistoryItem, index: number): PhotoCard => ({
                id: item._id || uuidv4(),
                year: item.year,
                description: item.description,
                images: [], // Images will be uploaded again only if new ones are added
                imagePreviews: item.imagePreviews || [], // These are actual Cloudinary URLs
                saved: true,
                sequence: item.sequence ?? index,
            }));
            setCards(initialCards);
        }
    }, [photoHistory]);

    if (isLoading) return <div className="text-center">Loading...</div>;



    return (
        <div className="space-y-6 p-6 max-w-4xl mx-auto">
            <header>
                <h1 className="text-3xl font-bold text-black">📸 Photo History</h1>
                <p className="text-gray-600 mt-1">Manage and sort club visuals by year.</p>
            </header>

            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="font-semibold text-lg text-black">Club Photo History</h2>
                <p className="text-gray-500 text-sm">Edit and sort historical photo cards below.</p>
            </div>

            <div className="flex justify-end gap-2">
                <button
                    onClick={addCard}
                    className="inline-flex items-center bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 cursor-pointer transition duration-200"
                >
                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                    Add Card
                </button>
                <button
                    onClick={handleSubmitAll}
                    className="inline-flex items-center bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer transition duration-200"
                >
                    <FontAwesomeIcon icon={faCircleCheck} className="mr-2" />
                    Save Photo History
                </button>
            </div>

            <DndContext
                collisionDetection={closestCenter}
                onDragEnd={({ active, over }) => {
                    if (over && active.id !== over.id) {
                        const oldIndex = cards.findIndex((c) => c.id === active.id);
                        const newIndex = cards.findIndex((c) => c.id === over.id);
                        const newCards = arrayMove(cards, oldIndex, newIndex);
                        setCards(updateSequences(newCards));
                    }
                }}
            >
                <SortableContext items={cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-6">
                        {cards.map((card) => (
                            <SortableCard
                                key={card.id}
                                card={card}
                                onChange={updateCard}
                                onDelete={deleteCard}
                                onSave={saveCard}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    );
}
