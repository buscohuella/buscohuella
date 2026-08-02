import type { CreatePetData, Pet, PetSpecies, UpdatePetData } from '@buscohuella/pet-domain';
import type { SupabaseClient } from '@supabase/supabase-js';

import type { Database } from './database.types.js';
import { normalizePetDataError } from './errors.js';
import {
  mapCreatePetToInsert,
  mapPetRow,
  mapPetSpeciesRow,
  mapUpdatePetToUpdate,
} from './mappers.js';

export class PetRepository {
  constructor(private readonly client: SupabaseClient<Database>) {}

  async listEnabledSpecies(options?: {
    mvpOnly?: boolean;
  }): Promise<PetSpecies[]> {
    let query = this.client
      .from('pet_species')
      .select('*')
      .eq('is_enabled', true)
      .order('sort_order', { ascending: true });

    if (options?.mvpOnly) {
      query = query.eq('mvp_enabled', true);
    }

    const { data, error } = await query;

    if (error) throw normalizePetDataError(error);

    return (data ?? []).map(mapPetSpeciesRow);
  }

  async listOwnPets(): Promise<Pet[]> {
    const { data, error } = await this.client
      .from('pets')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) throw normalizePetDataError(error);

    return (data ?? []).map(mapPetRow);
  }

  async getOwnPetById(id: string): Promise<Pet> {
    const { data, error } = await this.client
      .from('pets')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw normalizePetDataError(error, 'PET_NOT_FOUND');

    return mapPetRow(data);
  }

  async createPet(ownerId: string, input: CreatePetData): Promise<Pet> {
    const { data, error } = await this.client
      .from('pets')
      .insert(mapCreatePetToInsert(ownerId, input))
      .select('*')
      .single();

    if (error) throw normalizePetDataError(error);

    return mapPetRow(data);
  }

  async updatePet(id: string, input: UpdatePetData): Promise<Pet> {
    const { data, error } = await this.client
      .from('pets')
      .update(mapUpdatePetToUpdate(input))
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw normalizePetDataError(error, 'PET_NOT_FOUND');

    return mapPetRow(data);
  }

  async archivePet(id: string, archivedAt = new Date().toISOString()): Promise<Pet> {
    const { data, error } = await this.client
      .from('pets')
      .update({
        status: 'ARCHIVED',
        archived_at: archivedAt,
        deceased_at: null,
      })
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw normalizePetDataError(error, 'PET_NOT_FOUND');

    return mapPetRow(data);
  }

  async restorePet(id: string): Promise<Pet> {
    const { data, error } = await this.client
      .from('pets')
      .update({
        status: 'ACTIVE',
        archived_at: null,
        deceased_at: null,
      })
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw normalizePetDataError(error, 'PET_NOT_FOUND');

    return mapPetRow(data);
  }

  async markPetAsDeceased(id: string, deceasedAt: string): Promise<Pet> {
    const { data, error } = await this.client
      .from('pets')
      .update({
        status: 'DECEASED',
        archived_at: null,
        deceased_at: deceasedAt,
      })
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw normalizePetDataError(error, 'PET_NOT_FOUND');

    return mapPetRow(data);
  }
}
