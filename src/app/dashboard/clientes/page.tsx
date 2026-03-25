"use client";

import React, { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { MoreHorizontal, Archive, Eye, Inbox, Star, Clock } from "lucide-react";

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
    is_archived?: boolean;
    created_at: string;
}

export default function ClientManagerPage() {
    const [clients, setClients] = useState<ClientMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedClient, setSelectedClient] = useState<ClientMessage | null>(null);
    const [activeTab, setActiveTab] = useState<'contactos' | 'archivados'>('contactos');
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

    const fetchClients = useCallback(async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("contact_messages")
            .select("*")
            .eq('is_archived', activeTab === 'archivados')
            .order("created_at", { ascending: false });

        if (!error && data) {
            setClients(data as ClientMessage[]);
        }
        setLoading(false);
    }, [activeTab]);

    useEffect(() => {
        Promise.resolve().then(() => fetchClients());
    }, [fetchClients]);

    const handleArchive = async (id: string, archive: boolean) => {
        const { error } = await supabase
            .from("contact_messages")
            .update({ is_archived: archive })
            .eq('id', id);

        if (error) {
            console.error("Error archiving client:", error);
            alert("Error al archivar: " + error.message);
        } else {
            setClients(prev => prev.filter(c => c.id !== id));
            setOpenDropdownId(null);
        }
    };

    const toggleDropdown = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setOpenDropdownId(openDropdownId === id ? null : id);
    };

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = () => setOpenDropdownId(null);
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, []);

    return (
        <div className="pb-8 max-w-full">
            <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-2xl font-normal text-neutral-100 mb-1">
                        Gestor de Clientes
                    </h1>
                    <p className="text-sm text-neutral-400">
                        Administra los mensajes y solicitudes de tus clientes.
                    </p>
                </div>

                <div className="flex bg-[#0a0a0a] border border-neutral-800 p-1 rounded-xl">
                    <button
                        onClick={() => setActiveTab('contactos')}
                        className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm transition-all duration-300 ${
                            activeTab === 'contactos'
                                ? "bg-neutral-800 text-white shadow-lg"
                                : "text-neutral-500 hover:text-neutral-300"
                        }`}
                    >
                        <Inbox size={16} /> Contactos
                    </button>
                    <button
                        onClick={() => setActiveTab('archivados')}
                        className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm transition-all duration-300 ${
                            activeTab === 'archivados'
                                ? "bg-neutral-800 text-white shadow-lg"
                                : "text-neutral-500 hover:text-neutral-300"
                        }`}
                    >
                        <Archive size={16} /> Archivados
                    </button>
                </div>
            </header>

            <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl overflow-visible shadow-sm">
                <table className="w-full text-left text-sm border-collapse">
                    <thead>
                        <tr className="border-b border-neutral-800 bg-neutral-900/30">
                            <th className="px-6 py-4 font-normal text-neutral-500 uppercase tracking-widest text-[10px]">Fecha</th>
                            <th className="px-6 py-4 font-normal text-neutral-500 uppercase tracking-widest text-[10px]">Nombre</th>
                            <th className="px-6 py-4 font-normal text-neutral-500 uppercase tracking-widest text-[10px]">Email</th>
                            <th className="px-6 py-4 font-normal text-neutral-500 uppercase tracking-widest text-[10px]">Asunto</th>
                            <th className="px-6 py-4 font-normal text-neutral-500 uppercase tracking-widest text-[10px]">Estado</th>
                            <th className="px-6 py-4 font-normal text-neutral-500 uppercase tracking-widest text-[10px] text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800/50">
                        {clients.map((client) => (
                            <tr key={client.id} className="group hover:bg-neutral-900/40 transition-all duration-300">
                                <td className="px-6 py-5 text-neutral-500 font-mono text-xs italic">
                                    {new Date(client.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-5 text-neutral-200 font-medium">
                                    {client.name}
                                </td>
                                <td className="px-6 py-5 text-neutral-500">
                                    {client.email}
                                </td>
                                <td className="px-6 py-5">
                                    <span className="bg-neutral-900/80 border border-neutral-800 px-2 py-1 rounded text-[10px] text-neutral-400 font-medium uppercase tracking-wider">
                                        {client.message_type === 'consulting' ? 'Consultoría UX' :
                                         client.message_type === 'diagnostic' ? 'Agendar Reunión' : 'Mensaje'}
                                    </span>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
                                        <span className="text-neutral-400 text-xs">
                                            {client.status || 'Pendiente'}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-5 relative text-right">
                                    <button
                                        onClick={(e) => toggleDropdown(client.id, e)}
                                        className="p-2 hover:bg-neutral-800 rounded-lg text-neutral-500 hover:text-white transition-colors"
                                    >
                                        <MoreHorizontal size={18} />
                                    </button>

                                    {/* Dropdown Menu */}
                                    {openDropdownId === client.id && (
                                        <div className="absolute right-6 top-14 w-48 bg-[#121212] border border-neutral-800 rounded-xl shadow-2xl z-50 py-2 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                                            <button
                                                onClick={() => setSelectedClient(client)}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-neutral-300 hover:bg-neutral-800 transition-colors text-left"
                                            >
                                                <Eye size={14} className="text-[#5b4eff]" /> Ver Detalles
                                            </button>
                                            
                                            <button
                                                onClick={() => handleArchive(client.id, activeTab === 'contactos')}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-neutral-300 hover:bg-neutral-800 transition-colors text-left border-t border-neutral-800/50"
                                            >
                                                <Archive size={14} className="text-neutral-500" />
                                                {activeTab === 'contactos' ? 'Archivar' : 'Restaurar'}
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {loading && (
                    <div className="p-12 text-center">
                        <div className="w-6 h-6 border-2 border-[#5b4eff] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-neutral-500 text-xs">Cargando datos...</p>
                    </div>
                )}
                {!loading && clients.length === 0 && (
                    <div className="p-16 text-center">
                        <div className="w-16 h-16 bg-neutral-900 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Archive size={28} className="text-neutral-700" />
                        </div>
                        <h3 className="text-neutral-300 font-medium mb-1">No hay {activeTab}</h3>
                        <p className="text-neutral-500 text-sm">Tu bandeja de entrada está limpia.</p>
                    </div>
                )}
            </div>

            {selectedClient && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-in fade-in duration-300" onClick={() => setSelectedClient(null)}>
                    <div className="bg-[#0a0a0a] border border-neutral-800 rounded-2xl p-8 max-w-2xl w-full shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-10 border-b border-neutral-800 pb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-[#5b4eff]/10 rounded-xl flex items-center justify-center text-[#5b4eff]">
                                    <Eye size={20} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-medium text-neutral-100">Detalles del Contacto</h2>
                                    <p className="text-xs text-neutral-500 italic">Enviado el {new Date(selectedClient.created_at).toLocaleString()}</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedClient(null)} className="p-2 hover:bg-neutral-800 rounded-lg text-neutral-500 hover:text-neutral-300 transition-colors transition-transform active:scale-90">✕</button>
                        </div>
                        
                        <div className="flex flex-col gap-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="bg-neutral-900/40 p-5 rounded-xl border border-neutral-800/50 relative overflow-hidden group">
                                    <UserIcon className="absolute -right-4 -bottom-4 text-neutral-800/20 group-hover:scale-110 transition-transform duration-500" size={80} />
                                    <strong className="text-neutral-500 block text-[10px] uppercase tracking-widest mb-2 font-bold">Solicitante</strong>
                                    <span className="text-white text-lg font-medium relative z-10">{selectedClient.name}</span>
                                </div>
                                <div className="bg-neutral-900/40 p-5 rounded-xl border border-neutral-800/50 relative overflow-hidden group">
                                    <MailIcon className="absolute -right-4 -bottom-4 text-neutral-800/20 group-hover:scale-110 transition-transform duration-500" size={80} />
                                    <strong className="text-neutral-500 block text-[10px] uppercase tracking-widest mb-2 font-bold">Email</strong>
                                    <a href={`mailto:${selectedClient.email}`} className="text-[#5b4eff] text-lg font-medium hover:underline relative z-10">{selectedClient.email}</a>
                                </div>
                            </div>

                            <div className="bg-neutral-900/40 p-6 rounded-xl border border-neutral-800/50">
                                <strong className="text-neutral-500 block text-[10px] uppercase tracking-widest mb-4 font-bold">Información del Proyecto</strong>
                                <div className="flex flex-wrap gap-4">
                                    <div className="flex items-center gap-2 bg-[#121212] px-4 py-2 rounded-lg border border-neutral-800">
                                        <Star size={14} className="text-[#5b4eff]" />
                                        <span className="text-xs text-neutral-300">
                                            {selectedClient.message_type === 'consulting' ? 'Consultoría UX' :
                                             selectedClient.message_type === 'diagnostic' ? 'Agendar Reunión' : 'Mensaje'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-[#121212] px-4 py-2 rounded-lg border border-neutral-800">
                                        <Clock size={14} className="text-neutral-500" />
                                        <span className="text-xs text-neutral-300">{selectedClient.status || 'Pendiente'}</span>
                                    </div>
                                </div>
                            </div>
                            
                            {selectedClient.message && (
                                <div className="animate-in slide-in-from-bottom-2 duration-500">
                                    <strong className="text-neutral-500 block text-[10px] uppercase tracking-widest mb-3 font-bold">Mensaje / Requerimiento</strong>
                                    <div className="text-neutral-300 bg-[#080808] border border-neutral-800 p-6 rounded-2xl text-[0.95rem] leading-relaxed whitespace-pre-wrap font-light italic shadow-inner">
                                        &quot;{selectedClient.message}&quot;
                                    </div>
                                </div>
                            )}

                            {selectedClient.message_type === 'consulting' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#5b4eff]/5 rounded-2xl p-6 border border-[#5b4eff]/10">
                                    <div className="flex flex-col gap-1">
                                        <strong className="text-[#5b4eff] text-[10px] uppercase tracking-widest font-bold">Inversión Estimada</strong>
                                        <span className="text-2xl font-normal text-neutral-100">${selectedClient.budget} <span className="text-xs text-neutral-500 font-normal">USD</span></span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <strong className="text-[#5b4eff] text-[10px] uppercase tracking-widest font-bold">Plazo deseado</strong>
                                        <span className="text-2xl font-normal text-neutral-100">{selectedClient.estimated_time || 'Por definir'}</span>
                                    </div>
                                    <div className="col-span-1 md:col-span-2 mt-4 pt-4 border-t border-[#5b4eff]/10">
                                        <strong className="text-[#5b4eff] block text-[10px] uppercase tracking-widest mb-2 font-bold">Canal / URL</strong>
                                        <a href={selectedClient.target_url} target="_blank" rel="noreferrer" className="text-neutral-300 hover:text-[#5b4eff] hover:underline break-all text-sm">{selectedClient.target_url || 'No proporcionada'}</a>
                                    </div>
                                </div>
                            )}

                            {selectedClient.message_type === 'diagnostic' && (
                                <div className="bg-[#5b4eff]/5 rounded-2xl p-8 border border-[#5b4eff]/10 text-center flex flex-col items-center gap-4 animate-in zoom-in-95 duration-500">
                                    <div className="w-16 h-16 bg-[#5b4eff] rounded-2xl flex items-center justify-center text-white shadow-xl shadow-[#5b4eff]/20">
                                        <CalendarIcon size={32} />
                                    </div>
                                    <div>
                                        <strong className="text-[#5b4eff] block text-[10px] uppercase tracking-widest mb-1 font-bold">Horario Reservado (Chile Time)</strong>
                                        <span className="text-3xl font-light text-neutral-100 tracking-tight">{selectedClient.meeting_time}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Internal icons to avoid import issues if not explicitly available in lucide
function UserIcon({ className, size }: { className?: string, size?: number }) {
    return <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
}

function MailIcon({ className, size }: { className?: string, size?: number }) {
    return <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
}

function CalendarIcon({ size }: { size?: number }) {
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
}
