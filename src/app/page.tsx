// src/app/page.tsx
'use client';

import React, { useState, useMemo, useCallback } from 'react';

// --- DATOS MOCK (ESTRUCTURA COMPLEJA ANIDADA) ---
const productsData = [
  { id: 1, name: 'MacBook Pro 14', category: 'Laptops', brand: 'Apple', price: 1999, specs: { ram: '16GB', color: 'Space Gray' } },
  { id: 2, name: 'ThinkPad X1 Carbon', category: 'Laptops', brand: 'Lenovo', price: 1799, specs: { ram: '16GB', color: 'Black' } },
  { id: 3, name: 'iPad Pro 11', category: 'Tablets', brand: 'Apple', price: 799, specs: { ram: '8GB', color: 'Silver' } },
  { id: 4, name: 'Galaxy Tab S9', category: 'Tablets', brand: 'Samsung', price: 699, specs: { ram: '12GB', color: 'Beige' } },
  { id: 5, name: 'iPhone 15 Pro', category: 'Phones', brand: 'Apple', price: 999, specs: { ram: '8GB', color: 'Blue' } },
  { id: 6, name: 'Galaxy S24 Ultra', category: 'Phones', brand: 'Samsung', price: 1199, specs: { ram: '12GB', color: 'Titanium' } },
  { id: 7, name: 'Razer Blade 15', category: 'Laptops', brand: 'Razer', price: 2499, specs: { ram: '32GB', color: 'Black' } },
];

// --- TIPOS ESTRICTOS ---
export type Product = typeof productsData[0];
export type FilterCategory = 'category' | 'brand' | 'ram';

// El estado almacena un arreglo de selecciones por cada categoría
export type FiltersState = Record<FilterCategory, string[]>;
// Almacena qué opciones tienen stock real basado en los filtros activos
export type AvailableFacets = Record<FilterCategory, Set<string>>;

const FILTER_OPTIONS: Record<FilterCategory, string[]> = {
  category: ['Laptops', 'Tablets', 'Phones'],
  brand: ['Apple', 'Samsung', 'Lenovo', 'Razer'],
  ram: ['8GB', '12GB', '16GB', '32GB']
};

// ============================================================================
// COMPONENTES DE UI MODULARES
// ============================================================================

interface FilterGroupProps {
  title: string;
  facetKey: FilterCategory;
  options: string[];
  activeFilters: FiltersState;
  availableFacets: AvailableFacets;
  onToggle: (key: FilterCategory, value: string) => void;
}

const FilterGroup: React.FC<FilterGroupProps> = ({ title, facetKey, options, activeFilters, availableFacets, onToggle }) => (
  <div className="border-b border-gray-200 py-5">
    <h3 className="font-anton uppercase tracking-wider text-sm text-[#111] mb-4">{title}</h3>
    <div className="space-y-3">
      {options.map(option => {
        const isSelected = activeFilters[facetKey].includes(option);
        const isAvailable = availableFacets[facetKey].has(option);

        return (
          <div key={option} className="flex items-center group">
            <input
              id={`${facetKey}-${option}`}
              type="checkbox"
              checked={isSelected}
              disabled={!isAvailable && !isSelected}
              onChange={() => onToggle(facetKey, option)}
              className="h-4 w-4 rounded border-gray-300 text-[#00A889] focus:ring-[#00A889] cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            />
            <label
              htmlFor={`${facetKey}-${option}`}
              className={`ml-3 text-sm font-mono tracking-wide transition-all duration-200 cursor-pointer flex-1
                ${!isAvailable && !isSelected ? 'text-gray-300 line-through cursor-not-allowed' : 'text-gray-700 group-hover:text-[#111]'}
                ${isSelected ? 'font-bold text-[#00A889]' : ''}
              `}
            >
              {option}
            </label>
          </div>
        );
      })}
    </div>
  </div>
);

const GuideModal = ({ onClose }: { onClose: () => void }) => (
  // Corregido: z-[200] por z-50
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
    <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[90vh]">
      <header className="bg-[#111] p-6 flex justify-between items-center shrink-0">
        <h2 className="font-anton text-2xl uppercase tracking-widest text-white">Manual del <span className="text-[#00A889]">Motor de Búsqueda</span></h2>
        <button onClick={onClose} className="text-gray-400 hover:text-white"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
      </header>
      <div className="p-6 overflow-y-auto flex-1 scrollbar-thin">
        <div className="mb-6 p-5 bg-green-50 rounded-xl border border-green-200">
          <h3 className="font-bold text-green-900 mb-2 uppercase tracking-wide text-sm">💡 ¿Qué hace especial a este filtro?</h3>
          {/* Corregido: Comillas escapadas con &quot; */}
          <p className="text-sm text-green-800 leading-relaxed">
            Implementa una <strong>Matemática de Conjuntos Cruzada</strong>. No es un simple filtro visual. Calcula dinámicamente qué combinaciones de atributos existen realmente en la base de datos para evitar que el usuario llegue a una pantalla de &quot;Cero resultados&quot;.
          </p>
        </div>
        {/* Corregido: Título modificado */}
        <h3 className="text-lg font-bold text-[#111] mb-3 font-mono uppercase border-b pb-2">Características Principales</h3>
        <ul className="space-y-4 text-sm text-gray-700">
          <li><strong className="text-[#111] bg-gray-100 px-2 py-1 rounded">Evaluación Inversa (Faceted Logic):</strong> Si filtras por <em>Teléfonos</em>, la marca <em>Lenovo</em> se tacha y se bloquea. El sistema sabe que no hay teléfonos Lenovo antes de que intentes hacer clic.</li>
          <li><strong className="text-[#111] bg-gray-100 px-2 py-1 rounded">OR interno, AND externo:</strong> Puedes seleccionar <em>Apple</em> y <em>Samsung</em> al mismo tiempo (actúa como O dentro de la marca), pero debe coincidir estrictamente con el Precio y la Categoría (actúa como Y entre diferentes grupos).</li>
          {/* Corregido: Comillas escapadas con &quot; */}
          <li><strong className="text-[#111] bg-gray-100 px-2 py-1 rounded">Active Chips:</strong> Un gestor de estado superior permite renderizar &quot;Píldoras&quot; de filtros activos que pueden ser eliminados individualmente o limpiados en lote.</li>
          <li><strong className="text-[#111] bg-gray-100 px-2 py-1 rounded">Tipado Diamante:</strong> Cero errores de índice. La estructura usa genéricos y llaves de objeto estrictas en TypeScript.</li>
        </ul>
      </div>
      <footer className="bg-gray-50 p-4 border-t border-gray-200 flex justify-end shrink-0">
        <button onClick={onClose} className="font-anton uppercase tracking-widest text-white bg-[#00A889] hover:bg-green-700 px-6 py-2 rounded-lg transition-colors">Entendido</button>
      </footer>
    </div>
  </div>
);

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export default function FacetedFilterPage() {
  const [activeFilters, setActiveFilters] = useState<FiltersState>({
    category: [],
    brand: [],
    ram: []
  });
  const [maxPrice, setMaxPrice] = useState<number>(3000);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // 1. Alternar estado de un filtro específico
  const handleToggleFilter = useCallback((facetKey: FilterCategory, value: string) => {
    setActiveFilters(prev => {
      const currentSelected = prev[facetKey];
      const isSelected = currentSelected.includes(value);

      return {
        ...prev,
        [facetKey]: isSelected
          ? currentSelected.filter(item => item !== value)
          : [...currentSelected, value]
      };
    });
  }, []);

  const clearAllFilters = () => {
    setActiveFilters({ category: [], brand: [], ram: [] });
    setMaxPrice(3000);
  };

  // 2. Extraer el valor real de un producto basado en la llave del filtro
  const getProductValue = (product: Product, key: FilterCategory): string => {
    if (key === 'ram') return product.specs.ram;
    return String(product[key as keyof Product]);
  };

  // 3. MOTOR DE CÁLCULO PRINCIPAL: Productos que cumplen TODAS las condiciones
  const filteredProducts = useMemo(() => {
    const keys: FilterCategory[] = ['category', 'brand', 'ram'];

    return productsData.filter(product => {
      if (product.price > maxPrice) return false;

      return keys.every(key => {
        if (activeFilters[key].length === 0) return true; // Si no hay filtro, pasa
        return activeFilters[key].includes(getProductValue(product, key));
      });
    });
  }, [activeFilters, maxPrice]);

  // 4. Calcular qué facetas tienen stock
  // Para saber si 'Lenovo' está disponible, filtramos los productos usando TODOS los filtros
  // ACTUALES EXCEPTO el filtro de 'marca'.
  const availableFacets = useMemo(() => {
    const facets: AvailableFacets = {
      category: new Set(),
      brand: new Set(),
      ram: new Set()
    };
    const keys: FilterCategory[] = ['category', 'brand', 'ram'];

    keys.forEach(targetKey => {
      // Filtramos la data cruzada ignorando la categoría actual
      const crossFiltered = productsData.filter(product => {
        if (product.price > maxPrice) return false;

        return keys.every(otherKey => {
          if (targetKey === otherKey) return true; // Ignorar a sí mismo
          if (activeFilters[otherKey].length === 0) return true;
          return activeFilters[otherKey].includes(getProductValue(product, otherKey));
        });
      });

      // Llenamos el Set con las opciones que sobrevivieron al filtro cruzado
      crossFiltered.forEach(product => {
        facets[targetKey].add(getProductValue(product, targetKey));
      });
    });

    return facets;
  }, [activeFilters, maxPrice]);

  const totalActiveCount = activeFilters.category.length + activeFilters.brand.length + activeFilters.ram.length;

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-10 font-sans flex flex-col">
      <header className="mb-8 border-b-2 pb-6 border-[#111] flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <div>
          <h1 className="font-anton text-4xl uppercase tracking-tighter text-[#111]">Faceted <span className="text-[#00A889]">Filters</span> UI</h1>
          <p className="text-gray-600 mt-2 text-sm leading-relaxed max-w-2xl">
            Motor de búsqueda e-commerce. Los filtros calculan intersecciones dinámicamente. Si seleccionas &quot;Phones&quot;, las marcas sin stock de teléfonos se bloquearán.
          </p>
        </div>
        <button onClick={() => setIsGuideOpen(true)} className="shrink-0 flex items-center gap-2 font-mono font-bold text-xs bg-[#111] text-white hover:bg-[#00A889] border-2 border-[#111] px-5 py-2.5 rounded-lg shadow-[4px_4px_0px_rgba(0,168,137,1)] hover:shadow-none hover:translate-y-1 hover:translate-x-1 transition-all">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          GUÍA DEL MOTOR
        </button>
      </header>

      <div className="flex flex-col lg:flex-row gap-8 flex-1">
        {/* SIDEBAR DE FILTROS */}
        <aside className="w-full lg:w-72 bg-white border-2 border-[#111] rounded-2xl p-6 shadow-xl shrink-0 h-fit">
          <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-[#111]">
            <h2 className="font-anton text-2xl uppercase tracking-widest text-[#111] flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
              Filtros
            </h2>
            {totalActiveCount > 0 && (
              <button onClick={clearAllFilters} className="text-xs font-mono font-bold text-red-500 hover:text-red-700 transition-colors">LIMPIAR</button>
            )}
          </div>

          <div className="border-b border-gray-200 pb-6 mb-2">
            <h3 className="font-anton uppercase tracking-wider text-sm text-[#111] mb-4">Precio Máximo</h3>
            <input
              type="range" min="500" max="3000" step="100"
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#00A889]"
            />
            <div className="flex justify-between text-xs font-mono text-gray-500 mt-3">
              <span>$500</span>
              <span className="font-bold text-[#00A889] bg-green-50 px-2 py-0.5 rounded text-sm tabular-nums shadow-sm border border-green-100">${maxPrice}</span>
              <span>$3000</span>
            </div>
          </div>

          <FilterGroup title="Categoría" facetKey="category" options={FILTER_OPTIONS.category} activeFilters={activeFilters} availableFacets={availableFacets} onToggle={handleToggleFilter} />
          <FilterGroup title="Marca" facetKey="brand" options={FILTER_OPTIONS.brand} activeFilters={activeFilters} availableFacets={availableFacets} onToggle={handleToggleFilter} />
          <FilterGroup title="Memoria RAM" facetKey="ram" options={FILTER_OPTIONS.ram} activeFilters={activeFilters} availableFacets={availableFacets} onToggle={handleToggleFilter} />
        </aside>

        {/* GRILLA DE PRODUCTOS Y CHIPS */}
        <section className="flex-1 flex flex-col">

          {/* Active Filters Chips Bar */}
          <div className="flex flex-wrap gap-2 mb-6 items-center min-h-8">
            <span className="text-sm font-mono text-gray-500 mr-2">Resultados: <strong className="text-[#111]">{filteredProducts.length}</strong></span>
            {(['category', 'brand', 'ram'] as FilterCategory[]).map(key =>
              activeFilters[key].map(val => (
                <span key={`${key}-${val}`} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#111] text-white shadow-sm animate-in fade-in zoom-in duration-200">
                  {val}
                  <button onClick={() => handleToggleFilter(key, val)} className="hover:text-red-400 transition-colors">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  </button>
                </span>
              ))
            )}
          </div>

          {/* Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <div key={product.id} className="bg-white border-2 border-gray-100 hover:border-[#111] rounded-2xl p-6 transition-all duration-300 hover:shadow-[8px_8px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 group flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#00A889] bg-green-50 px-2 py-1 rounded">{product.category}</span>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-gray-500 bg-gray-100 px-2 py-1 rounded">{product.brand}</span>
                    </div>
                    <h3 className="text-xl font-bold text-[#111] mb-2">{product.name}</h3>
                    <div className="text-sm text-gray-500 font-mono mb-6">RAM: <span className="text-gray-800 font-semibold">{product.specs.ram}</span> &bull; {product.specs.color}</div>
                  </div>
                  <div className="flex justify-between items-end border-t border-gray-100 pt-4">
                    <span className="text-2xl font-anton tracking-wider text-[#111]">${product.price}</span>
                    <button className="bg-gray-100 hover:bg-[#111] text-gray-700 hover:text-white px-4 py-2 rounded-lg text-xs font-mono font-bold transition-colors">
                      VER DETALLES
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center bg-white border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center animate-in fade-in">
              <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <h3 className="font-anton text-2xl uppercase tracking-widest text-[#111] mb-2">Cero Coincidencias</h3>
              <p className="text-gray-500 font-mono text-sm max-w-md mb-6">La combinación de filtros actual es demasiado estricta o supera el límite de precio de ${maxPrice}.</p>
              <button onClick={clearAllFilters} className="font-mono font-bold text-xs bg-[#111] text-white hover:bg-[#00A889] px-6 py-3 rounded-lg transition-colors">
                RESETEAR BÚSQUEDA
              </button>
            </div>
          )}
        </section>
      </div>

      {isGuideOpen && <GuideModal onClose={() => setIsGuideOpen(false)} />}
    </main>
  );
}
