"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export interface ClientMessage {
    id: string;
    name: string;
    email: string;
    message_type: string;
    message?: string;
    budget?: number;
    estimated_time?: string;
    target_url?: string;
    meeting_time?: string;
    status?: string;
    created_at: string;
}

export default function ClientManagerPage() {
    const [clients, setClients] = useState<ClientMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedClient, setSelectedClient] = useState<ClientMessage | null>(null);

    useEffect(() => {
        const fetchClients = async () => {
            const { data, error } = await supabase
                .from("contact_messages")
                .select("*")
                .order("created_at", { ascending: false });

            if (!error && data) {
                setClients(data as ClientMessage[]);
            }
            setLoading(false);
        };
        fetchClients();
    }, []);

    return (
        <div className="pb-8 max-w-5xl">
            <header className="mb-10">
                <h1 className="text-2xl font-normal text-neutral-100 mb-1">
                    Gestor de Clientes
                </h1>
                <p className="text-sm text-neutral-400">
                    Administra los mensajes y solicitudes de tus clientes.
                </p>
            </header>

            <div className="bg-[#0a0a0a] border border-neutral-800 rounded-lg overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                    <thead>
                        <tr className="border-b border-neutral-800">
                            <th className="px-6 py-4 font-normal text-neutral-400">Fecha</th>
                            <th className="px-6 py-4 font-normal text-neutral-400">Nombre</th>
                            <th className="px-6 py-4 font-normal text-neutral-400">Email</th>
                            <th className="px-6 py-4 font-normal text-neutral-400">Asunto</th>
                            <th className="px-6 py-4 font-normal text-neutral-400">Estado</th>
                            <th className="px-6 py-4 font-normal text-neutral-400">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.map((client, idx) => (
                            <tr key={client.id} className={`${idx !== clients.length - 1 ? "border-b border-neutral-800" : ""} hover:bg-neutral-900/50 transition-colors`}>
                                <td className="px-6 py-4 text-neutral-500">{new Date(client.created_at).toLocaleDateString()}</td>
                                <td className="px-6 py-4 text-neutral-300">{client.name}</td>
                                <td className="px-6 py-4 text-neutral-500">{client.email}</td>
                                <td className="px-6 py-4 text-neutral-400">{
                                    client.message_type === 'consulting' ? 'Consultoría UX' :
                                    client.message_type === 'diagnostic' ? 'Agendar Reunión' : 'Mensaje'
                                }</td>
                                <td className="px-6 py-4 text-neutral-500">{client.status || 'Pendiente'}</td>
                                <td className="px-6 py-4">
                                    <button 
                                        onClick={() => setSelectedClient(client)}
                                        className="text-[#5b4eff] hover:underline text-sm font-medium"
                                    >
                                        Ver Detalles
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {loading && <div className="p-8 text-center text-neutral-500 text-sm">Cargando clientes...</div>}
                {!loading && clients.length === 0 && <div className="p-8 text-center text-neutral-500 text-sm">No hay clientes aún.</div>}
            </div>

            {selectedClient && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-4" onClick={() => setSelectedClient(null)}>
                    <div className="bg-[#0a0a0a] border border-neutral-800 rounded-lg p-6 max-w-2xl w-full" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6 border-b border-neutral-800 pb-4">
                            <h2 className="text-lg font-normal text-neutral-100">Detalles del Cliente</h2>
                            <button onClick={() => setSelectedClient(null)} className="text-neutral-500 hover:text-neutral-300 transition-colors">✕</button>
                        </div>
                        <div className="flex flex-col gap-4 text-neutral-400">
                            <div className="grid grid-cols-2 gap-4">
                                <div><strong className="text-neutral-500 block text-xs uppercase tracking-widest mb-1">Nombre</strong> <span className="text-neutral-300">{selectedClient.name}</span></div>
                                <div><strong className="text-neutral-500 block text-xs uppercase tracking-widest mb-1">Email</strong> <a href={`mailto:${selectedClient.email}`} className="text-[#5b4eff] hover:underline">{selectedClient.email}</a></div>
                                <div className="col-span-2"><strong className="text-neutral-500 block text-xs uppercase tracking-widest mb-1">Asunto</strong> <span className="text-neutral-300">{
                                    selectedClient.message_type === 'consulting' ? 'Consultoría UX' :
                                    selectedClient.message_type === 'diagnostic' ? 'Agendar Reunión' : 'Mensaje'
                                }</span></div>
                            </div>
                            
                            {selectedClient.message && (
                                <div className="mt-2">
                                    <strong className="text-neutral-500 block text-xs uppercase tracking-widest mb-2">Mensaje adjunto</strong>
                                    <div className="text-neutral-300 bg-[#161616] border border-neutral-800 p-4 rounded-md text-sm leading-relaxed whitespace-pre-wrap">{selectedClient.message}</div>
                                </div>
                            )}

                            {selectedClient.message_type === 'consulting' && (
                                <div className="mt-2 grid grid-cols-2 gap-4 bg-[#5b4eff]/10 rounded-md p-5 border border-[#5b4eff]/20">
                                    <div><strong className="text-[#5b4eff] block text-xs uppercase tracking-widest mb-1">Inversión Disp.</strong> <span className="text-lg font-medium text-neutral-200">${selectedClient.budget} USD</span></div>
                                    <div><strong className="text-[#5b4eff] block text-xs uppercase tracking-widest mb-1">Tiempo est.</strong> <span className="text-lg font-medium text-neutral-200">{selectedClient.estimated_time || 'No indicado'}</span></div>
                                    <div className="col-span-2 mt-2"><strong className="text-[#5b4eff] block text-xs uppercase tracking-widest mb-1">URL a evaluar</strong> <a href={selectedClient.target_url} target="_blank" rel="noreferrer" className="text-neutral-300 hover:text-[#5b4eff] hover:underline break-all">{selectedClient.target_url}</a></div>
                                </div>
                            )}

                            {selectedClient.message_type === 'diagnostic' && (
                                <div className="mt-2 flex flex-col items-center justify-center gap-2 bg-[#5b4eff]/10 rounded-md p-5 border border-[#5b4eff]/20 text-center">
                                    <strong className="text-[#5b4eff] block text-xs uppercase tracking-widest">Horario elegido para reunión</strong>
                                    <span className="text-xl font-medium text-neutral-200 tracking-wide">{selectedClient.meeting_time}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
