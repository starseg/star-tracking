"use client";
import Loading from "@/components/loading";
import { Menu } from "@/components/menu";
import api from "@/lib/axios";
import VehicleTrackerUpdateForm from "@/modules/vehicles-trackers/vehicle-tracker-update-form";
import { Vehicle, Tracker, VehicleTracker } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function UpdateVehicleTracker() {
  const [vehicleTracker, setVehicleTracker] = useState<VehicleTracker | null>(
    null
  );

  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const id = Number(params.get("id")) || 0;
  const fetch = async () => {
    try {
      const response = await api.get("vehicle-tracker/" + id);
      setVehicleTracker(response.data.vehicleTracker);
    } catch (error) {
      console.error("Erro ao obter dados:", error);
    }
  };
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const fetchVehicles = async () => {
    try {
      const response = await api.get("vehicle");
      setVehicles(response.data);
    } catch (error) {
      console.error("Erro ao obter dados:", error);
    }
  };
  const [trackers, setTrackers] = useState<Tracker[]>([]);
  const fetchTrackers = async () => {
    try {
      const response = await api.get("tracker");
      setTrackers(response.data);
    } catch (error) {
      console.error("Erro ao obter dados:", error);
    }
  };

  useEffect(() => {
    fetch();
    fetchVehicles();
    fetchTrackers();
  }, []);

  return (
    <>
      <Menu />
      <section className="flex flex-col justify-center items-center mb-12">
        <h1 className="text-4xl mt-2 mb-4">Atualizar relacionamento</h1>
        {vehicleTracker && vehicles && trackers ? (
          <VehicleTrackerUpdateForm
            preloadedValues={vehicleTracker}
            id={id}
            vehicles={vehicles}
            trackers={trackers}
          />
        ) : (
          <Loading />
        )}
      </section>
    </>
  );
}
