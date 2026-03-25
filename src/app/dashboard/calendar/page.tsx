"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Save, Calendar as CalendarIcon, Clock, Check, AlertCircle, Trash2, Plus } from "lucide-react";

const ALL_SLOTS = [
    "18:30 - 18:45 hrs",
    "18:45 - 19:00 hrs",
    "19:00 - 19:15 hrs",
    "19:15 - 19:30 hrs",
    "19:30 - 19:45 hrs",
    "19:45 - 20:00 hrs",
    "20:00 - 20:15 hrs",
    "20:15 - 20:30 hrs",
    "20:30 - 20:45 hrs",
    "20:45 - 21:00 hrs"
];

const DAYS = [
    { label: "LUNES", value: 1 },
    { label: "MARTES", value: 2 },
    { label: "MIÉRCOLES", value: 3 },
    { label: "JUEVES", value: 4 },
    { label: "VIERNES", value: 5 },
    { label: "SÁBADO", value: 6 },
    { label: "DOMINGO", value: 0 },
];

export default function CalendarManagementPage() {
    const [restrictedDays, setRestrictedDays] = useState<number[]>([]);
    const [dailyRestrictions, setDailyRestrictions] = useState<Record<string, string[]>>({});
    const [selectedDayTab, setSelectedDayTab] = useState<number>(1);
    const [recordId, setRecordId] = useState<string | null>(null);
    
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");

    useEffect(() => {
        const fetchSettings = async () => {
            const { data, error } = await supabase
                .from("availability_settings")
                .select("*")
                .order('updated_at', { ascending: false })
                .limit(1);

            if (!error && data && data.length > 0) {
                const settings = data[0];
                setRecordId(settings.id);
                setRestrictedDays(settings.restricted_days || []);
                setDailyRestrictions(settings.daily_slot_restrictions || {});
            }
            setIsLoading(false);
        };
        fetchSettings();
    }, []);

    const toggleGlobalDay = (day: number) => {
        setRestrictedDays(prev => 
            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
        );
    };

    const toggleSlotForSelectedDay = (slot: string) => {
        const dayKey = selectedDayTab.toString();
        const currentSlots = dailyRestrictions[dayKey] || [];
        
        const newSlots = currentSlots.includes(slot) 
            ? currentSlots.filter(s => s !== slot) 
            : [...currentSlots, slot];
            
        setDailyRestrictions(prev => ({
            ...prev,
            [dayKey]: newSlots
        }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        setSaveStatus("idle");

        const { error } = await supabase
            .from("availability_settings")
            .upsert({
                id: recordId || '00000000-0000-0000-0000-000000000001',
                restricted_days: restrictedDays,
                restricted_slots: [], // Limpiar restricciones globales antiguas
                daily_slot_restrictions: dailyRestrictions,
                updated_at: new Date().toISOString()
            });

        if (error) {
            console.error("Error saving settings:", error);
            setSaveStatus("error");
        } else {
            setSaveStatus("success");
            setTimeout(() => setSaveStatus("idle"), 3000);
        }
        setIsSaving(false);
    };

    const currentDayRestrictedSlots = dailyRestrictions[selectedDayTab.toString()] || [];
    const isDayGloballyRestricted = restrictedDays.includes(selectedDayTab);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-20">
                <div className="w-10 h-10 border-2 border-[#5b4eff] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="pb-20 max-w-full">
            <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-2xl font-normal text-neutral-100 mb-1">
                        Gestión Diaria de Calendario
                    </h1>
                    <p className="text-sm text-neutral-400 max-w-2xl">
                        Personaliza la disponibilidad bloqueando días completos o rangos específicos para cada día de la semana.
                    </p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 bg-[#5b4eff] hover:bg-[#4a3fff] text-white px-8 py-3 rounded-xl transition-all duration-300 disabled:opacity-50 shadow-lg shadow-[#5b4eff]/10 hover:shadow-[#5b4eff]/20"
                >
                    {isSaving ? "Guardando..." : (
                        <>
                            <Save size={18} /> Guardar Configuración
                        </>
                    )}
                </button>
            </header>

            {saveStatus === "success" && (
                <div className="mb-8 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
                    <Check size={20} /> ¡Disponibilidad actualizada y publicada correctamente!
                </div>
            )}

            {/* Selector de Día (Tabs) */}
            <div className="flex flex-wrap gap-2 mb-8 bg-[#0a0a0a] p-2 border border-neutral-800 rounded-2xl">
                {DAYS.map((day) => {
                    const isActive = selectedDayTab === day.value;
                    const isRestricted = restrictedDays.includes(day.value);
                    return (
                        <button
                            key={day.value}
                            onClick={() => setSelectedDayTab(day.value)}
                            className={`flex-1 min-w-[100px] py-3 px-4 rounded-xl text-xs font-semibold tracking-wider transition-all duration-300 flex items-center justify-center gap-2 ${
                                isActive
                                    ? "bg-[#5b4eff] text-white shadow-lg shadow-[#5b4eff]/20"
                                    : isRestricted
                                        ? "bg-red-500/10 text-red-400 border border-red-500/20"
                                        : "text-neutral-500 hover:bg-neutral-900 border border-transparent hover:border-neutral-800"
                            }`}
                        >
                            {day.label}
                            {isRestricted && <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div>}
                        </button>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 items-start">
                
                {/* Configuración del Día Seleccionado */}
                <div className="bg-[#0a0a0a] border border-neutral-800 rounded-2xl overflow-hidden shadow-sm">
                    <div className="bg-neutral-900/50 p-6 border-b border-neutral-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDayGloballyRestricted ? 'bg-red-500/10 text-red-400' : 'bg-[#5b4eff]/10 text-[#5b4eff]'}`}>
                                <CalendarIcon size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-medium text-neutral-100 uppercase tracking-tight">
                                    {DAYS.find(d => d.value === selectedDayTab)?.label}
                                </h2>
                                <p className="text-sm text-neutral-500">Configuración específica para este día</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 bg-[#121212] p-3 rounded-xl border border-neutral-800">
                            <span className="text-xs text-neutral-400 font-medium">Bloquear día completo</span>
                            <button
                                onClick={() => toggleGlobalDay(selectedDayTab)}
                                className={`relative w-12 h-6 rounded-full transition-colors duration-200 outline-none ${isDayGloballyRestricted ? 'bg-red-500' : 'bg-neutral-800'}`}
                            >
                                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${isDayGloballyRestricted ? 'translate-x-6' : ''}`}></div>
                            </button>
                        </div>
                    </div>

                    <div className="p-8">
                        {!isDayGloballyRestricted ? (
                            <div className="animate-in fade-in duration-500">
                                <div className="flex items-center gap-3 mb-8">
                                    <Clock className="text-[#5b4eff]" size={20} />
                                    <h3 className="text-lg font-normal text-neutral-200">Gestión de bloques horarios</h3>
                                </div>
                                <p className="text-sm text-neutral-500 mb-8 max-w-xl">
                                    Haz clic en el bloque para desactivarlo. Los bloques seleccionados en <span className="text-red-400 font-medium">rojo</span> no estarán disponibles para agendar.
                                </p>
                                
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                                    {ALL_SLOTS.map((slot) => {
                                        const isRestricted = currentDayRestrictedSlots.includes(slot);
                                        return (
                                            <button
                                                key={slot}
                                                onClick={() => toggleSlotForSelectedDay(slot)}
                                                className={`relative py-4 px-2 rounded-xl border text-[0.8rem] transition-all duration-300 font-medium whitespace-nowrap overflow-hidden ${
                                                    isRestricted
                                                        ? "bg-red-500/10 border-red-500/30 text-red-300 shadow-inner"
                                                        : "bg-[#121212] border-neutral-800 text-neutral-400 hover:border-[#5b4eff]/50 hover:text-neutral-100"
                                                }`}
                                            >
                                                {slot}
                                                {isRestricted && (
                                                    <div className="absolute top-0 right-0 w-6 h-6 bg-red-500/20 flex items-center justify-center rounded-bl-xl border-l border-b border-red-500/30">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-16 text-center animate-in zoom-in-95 duration-300">
                                <div className="w-20 h-20 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mb-6 border border-red-500/20">
                                    <Trash2 size={32} />
                                </div>
                                <h3 className="text-xl font-medium text-neutral-200 mb-2">Día restringido por completo</h3>
                                <p className="text-sm text-neutral-500 max-w-sm">
                                    No se pueden configurar bloques horarios individuales porque el día está configurado como no disponible en el selector superior.
                                </p>
                                <button 
                                    onClick={() => toggleGlobalDay(selectedDayTab)}
                                    className="mt-6 text-[#5b4eff] hover:underline text-sm font-medium flex items-center gap-2"
                                >
                                    <Plus size={16} /> Rehabilitar el día para configurar bloques
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-10 p-6 bg-[#0a0a0a] border border-neutral-800 rounded-2xl flex items-start gap-4">
               <div className="bg-[#5b4eff]/10 p-2.5 rounded-xl text-[#5b4eff]">
                    <AlertCircle size={20} />
               </div>
                <div>
                    <h4 className="text-sm font-medium text-neutral-200 mb-1">Información sobre la sincronización</h4>
                    <p className="text-sm text-neutral-500 leading-relaxed max-w-3xl">
                        Estas configuraciones sobrescriben los valores globales. Los cambios realizados aquí se verán reflejados en el formulario de contacto para cualquier usuario que seleccione una fecha que corresponda a este día de la semana.
                    </p>
                </div>
            </div>
        </div>
    );
}
