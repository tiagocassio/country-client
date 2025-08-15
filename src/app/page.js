'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './contexts/AuthContext';
import ThemeToggle from './components/ThemeToggle';
import LoadingSkeleton from './components/LoadingSkeleton';
import { useTranslation } from '../i18n/useTranslation';
import { API_ENDPOINTS } from '../utils/api';

export default function Home() {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const router = useRouter();
  const { user, token, logout, getAuthHeaders, loading: authLoading } = useAuth();
  const { t } = useTranslation();



  const fetchCountries = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.COUNTRIES, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        if (response.status === 401) {
          logout();
          router.push('/login');
          return;
        }
        throw new Error(t('auth.failedToFetchCountries'));
      }
      const data = await response.json();
      setCountries(data.data || []);
      setHasMore(data.pagination?.page < data.pagination?.last);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCountryDetails = async (countrySlug) => {
    try {
      const response = await fetch(API_ENDPOINTS.COUNTRY_BY_SLUG(countrySlug), {
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        if (response.status === 401) {
          logout();
          router.push('/login');
          return;
        }
        throw new Error(t('auth.failedToFetchCountryDetails'));
      }
      const data = await response.json();
      setSelectedCountry(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCountryClick = (country) => {
    fetchCountryDetails(country.id);
  };

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.alpha2_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.alpha3_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const loadMoreCountries = () => {
    if (!token || !user) {
      console.log('Cannot load more countries: no authentication');
      return;
    }
    
    if (hasMore && !isLoadingMore) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchMoreCountries(nextPage);
    }
  };

  const fetchMoreCountries = async (page) => {
    try {
      setIsLoadingMore(true);
      
      if (!token) {
        throw new Error(t('auth.noAuthenticationTokenAvailable'));
      }
      
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
      
      console.log('Fetching more countries with headers:', headers);
      
      const response = await fetch(`${API_ENDPOINTS.COUNTRIES}?page=${page}`, {
        headers,
      });
      if (!response.ok) {
        if (response.status === 401) {
          logout();
          router.push('/login');
          return;
        }
        throw new Error(t('auth.failedToFetchMoreCountries'));
      }
      const data = await response.json();
      setCountries(prev => [...prev, ...(data.data || [])]);
      setHasMore(data.pagination?.page < data.pagination?.last);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const closeDetails = () => {
    setSelectedCountry(null);
  };

  useEffect(() => {
    // Wait for auth to finish loading
    if (authLoading) {
      return;
    }
    
    if (!token || !user) {
      setLoading(false);
      router.push('/login');
      return;
    }
    
    if (token && user) {
      fetchCountries();
    }
  }, [token, user, authLoading, router]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 100) {
        loadMoreCountries();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, isLoadingMore, token, user]);

  if (loading || authLoading) {
    return <LoadingSkeleton />;
  }

  if (!token || !user) {
    return null;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="alert alert-error max-w-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
                      <span>{t('auth.error')}: {error}</span>
                      <button className="btn btn-sm" onClick={fetchCountries}>{t('auth.retry')}</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
        <div className="navbar bg-base-100 shadow-lg">
        <div className="navbar-start">
                      <a className="btn btn-ghost text-xl">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              {t('countries.worldCountries')}
            </a>
        </div>
        <div className="navbar-end">
          <div className="form-control mr-4">
            <input
              type="text"
              placeholder={t('countries.searchCountries')}
              className="input input-bordered w-64 h-10 text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <ThemeToggle />
          <div className="dropdown dropdown-end ml-2">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full bg-primary text-primary-content flex items-center justify-center">
                <span className="text-sm font-semibold">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              <li className="menu-title">
                <span className="text-sm text-base-content/70">{user?.email}</span>
              </li>
              <li><button onClick={logout}>{t('auth.logout')}</button></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="container-fluid mx-auto px-4 py-8">
        {selectedCountry && (
          <div className="modal modal-open">
            <div className="modal-box max-w-4xl">
              <div className="flex justify-between items-start mb-6">
                <h3 className="font-bold text-2xl">{selectedCountry.name}</h3>
                <button className="btn btn-sm btn-circle btn-ghost" onClick={closeDetails}>✕</button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="card bg-base-100 shadow-xl">
                    <figure className="px-6 pt-6">
                      <img 
                        src={selectedCountry.flag} 
                        alt={`Flag of ${selectedCountry.name}`}
                        className="rounded-xl w-full h-48 object-cover"
                      />
                    </figure>
                    <div className="card-body">
                      <h2 className="card-title">{selectedCountry.official_name || selectedCountry.name}</h2>
                      <div className="stats stats-vertical shadow">
                        <div className="stat">
                          <div className="stat-title">{t('countries.population')}</div>
                          <div className="stat-value text-primary">{selectedCountry.population?.toLocaleString() || 'N/A'}</div>
                        </div>
                        <div className="stat">
                          <div className="stat-title">{t('countries.area')}</div>
                          <div className="stat-value text-secondary">{selectedCountry.area ? `${selectedCountry.area.toLocaleString()} km²` : 'N/A'}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                      <h3 className="card-title text-lg mb-4">{t('countries.countryInformation')}</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="font-semibold">{t('countries.capital')}:</span>
                          <span>{selectedCountry.capital || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-semibold">{t('countries.region')}:</span>
                          <span>{selectedCountry.region || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-semibold">{t('countries.subregion')}:</span>
                          <span>{selectedCountry.subregion || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-semibold">{t('countries.alpha2Code')}:</span>
                          <span className="badge badge-primary">{selectedCountry.alpha2_code || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-semibold">{t('countries.alpha3Code')}:</span>
                          <span className="badge badge-secondary">{selectedCountry.alpha3_code || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-semibold">{t('countries.callingCode')}:</span>
                          <span>{selectedCountry.calling_code || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {(selectedCountry.currencies || selectedCountry.language || selectedCountry.time_zones) && (
                    <div className="card bg-base-100 shadow-xl">
                      <div className="card-body">
                        <h3 className="card-title text-lg mb-4">{t('countries.additionalDetails')}</h3>
                        <div className="space-y-3">
                          {selectedCountry.currencies && (
                            <div>
                              <span className="font-semibold">{t('countries.currencies')}:</span>
                              <div className="mt-1">
                                {Array.isArray(selectedCountry.currencies) ? 
                                  selectedCountry.currencies.map((currency, index) => (
                                    <span key={index} className="badge badge-outline mr-2">{currency}</span>
                                  )) : 
                                  <span className="badge badge-outline">{selectedCountry.currencies}</span>
                                }
                              </div>
                            </div>
                          )}
                          {selectedCountry.language && (
                            <div>
                              <span className="font-semibold">{t('countries.languages')}:</span>
                              <div className="mt-1">
                                {Array.isArray(selectedCountry.language) ? 
                                  selectedCountry.language.map((lang, index) => (
                                    <span key={index} className="badge badge-outline mr-2">{lang}</span>
                                  )) : 
                                  <span className="badge badge-outline">{selectedCountry.language}</span>
                                }
                              </div>
                            </div>
                          )}
                          {selectedCountry.time_zones && (
                            <div>
                              <span className="font-semibold">{t('countries.timeZones')}:</span>
                              <div className="mt-1">
                                {Array.isArray(selectedCountry.time_zones) ? 
                                  selectedCountry.time_zones.map((tz, index) => (
                                    <span key={index} className="badge badge-outline mr-2">{tz}</span>
                                  )) : 
                                  <span className="badge badge-outline">{selectedCountry.time_zones}</span>
                                }
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="modal-action">
                <button className="btn" onClick={closeDetails}>{t('countries.close')}</button>
              </div>
            </div>
            <div className="modal-backdrop" onClick={closeDetails}></div>
          </div>
        )}

        <div className="mb-8">
                      <h1 className="text-3xl font-bold text-center mb-2">{t('countries.worldCountries')}</h1>
            <p className="text-center text-base-content/70 mb-8">{t('countries.clickFlagForDetails')}</p>
          
          {searchTerm && (
            <div className="text-center mb-4">
              <p className="text-sm text-base-content/70">
                {t('countries.showingResults', { count: filteredCountries.length, total: countries.length })}
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 2xl:grid-cols-12 gap-4">
          {filteredCountries.map((country) => (
            <div
              key={country.id}
              className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105"
              onClick={() => handleCountryClick(country)}
            >
              <figure className="px-4 pt-4">
                <img
                  src={country.flag}
                  alt={`Bandeira do ${country.name}`}
                  className="rounded-xl w-full h-24 object-cover"
                />
              </figure>
              <div className="card-body p-4 text-center">
                <h2 className="card-title text-base font-semibold text-center">{country.name}</h2>
                <div className="flex justify-center space-x-2 mt-2">
                  <span className="badge badge-primary badge-sm">{country.alpha2_code}</span>
                  <span className="badge badge-secondary badge-sm">{country.alpha3_code}</span>
                </div>
                {country.capital && (
                  <p className="text-xs text-center text-base-content/70 mt-2">
                    {t('countries.capital')}: {country.capital}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredCountries.length === 0 && searchTerm && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🌍</div>
            <h3 className="text-xl font-semibold mb-2">{t('countries.noCountriesFound')}</h3>
            <p className="text-base-content/70">{t('countries.adjustSearchTerms')}</p>
          </div>
        )}

        {hasMore && (
          <div className="flex justify-center items-center mt-8 mb-4">
            <button
              className={`btn btn-primary ${isLoadingMore ? 'loading' : ''}`}
              onClick={loadMoreCountries}
              disabled={isLoadingMore || !token || !user}
            >
              {isLoadingMore ? t('countries.loading') : t('countries.loadMoreCountries')}
            </button>
          </div>
        )}

        {isLoadingMore && (
          <div className="flex justify-center items-center mt-4 mb-4">
            <div className="loading loading-spinner loading-md"></div>
            <span className="ml-2 text-base-content/70">{t('countries.loadingMore')}</span>
          </div>
        )}
      </div>
    </div>
  );
}
