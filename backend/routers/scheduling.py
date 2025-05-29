from fastapi import APIRouter, HTTPException, Query
from models.process import Process
from utils.file_loader import load_processes_from_file
from core.scheduler.fifo import simulate_fifo
from core.scheduler.sjf import simulate_sjf
from core.scheduler.srt import simulate_srt
from core.scheduler.round_robin import simulate_round_robin
from core.scheduler.priority import simulate_priority
from fastapi import UploadFile, File
from typing import List
import tempfile

router = APIRouter()

stored_processes: List[Process] = [] # memoria

@router.post("/simulation-a/upload-processes")
async def upload_processes(file: UploadFile = File(...)):
    # Guardar archivo temporalmente
    with tempfile.NamedTemporaryFile(delete=False, suffix=".txt") as tmp:
        contents = await file.read()
        tmp.write(contents)
        tmp_path = tmp.name

    try:
        processes = load_processes_from_file(tmp_path)
        global stored_processes
        stored_processes = processes
        return {
            "message": "Procesos cargados correctamente.",
            "processes": [vars(p) for p in processes]
        }
    except Exception as e:
        return {"error": str(e)}
    
@router.get("/simulation-a/fifo")
def run_fifo():
    if not stored_processes:
        raise HTTPException(status_code=400, detail="No hay procesos cargados.")
    
    result = simulate_fifo(stored_processes)
    return result

@router.get("/simulation-a/sjf")
def run_sjf():
    if not stored_processes:
        raise HTTPException(status_code=400, detail="No hay procesos cargados.")

    result = simulate_sjf(stored_processes)
    return result

@router.get("/simulation-a/srt")
def run_srt():
    global stored_processes
    if not stored_processes:
        raise HTTPException(status_code=400, detail="No hay procesos cargados.")
    
    result = simulate_srt(stored_processes)
    return result

@router.get("/simulation-a/round_robin")
def run_round_robin(quantum: int = Query(..., gt=0, description="Quantum debe ser mayor a 0")):
    if not stored_processes:
        raise HTTPException(status_code=400, detail="No hay procesos cargados.")
    
    result = simulate_round_robin(stored_processes, quantum)
    return result

@router.get("/simulation-a/priority")
def run_priority():
    if not stored_processes:
        raise HTTPException(status_code=400, detail="No hay procesos cargados.")
    
    result = simulate_priority(stored_processes)
    return result

@router.post("/simulation-a/clean-processes")
def clean_processes():
    global stored_processes
    stored_processes.clear()
    return {"success": True, "message": "Procesos eliminados correctamente"}

@router.get("/simulation-a/stored-processes")
def get_stored_processes():
    global stored_processes
    return {
        "processes": [vars(p) for p in stored_processes],
        "success": bool(stored_processes),
        "message": "Procesos cargados desde memoria" if stored_processes else "No hay procesos"
    }