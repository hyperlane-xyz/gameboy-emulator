import { Operation } from "../operation.model";
import { RegisterCode } from "../../registers/register-code.enum";
import { memory } from "@/memory/memory";
import { CPU } from "@/cpu/cpu";

export function createCompareOperations(cpu: CPU) {
  const compareOperations: Operation[] = [];
  const { registers } = cpu;

  function compareAndSetFlags(accumulatorVal: number, toSubtract: number) {
    const newValue = accumulatorVal - toSubtract;
    registers.flags.isResultZero = newValue === 0;
    registers.flags.isHalfCarry = (accumulatorVal & 0x0f) < (toSubtract & 0x0f);
    registers.flags.isSubtraction = true;
    registers.flags.isCarry = (accumulatorVal & 0xf0) < (toSubtract & 0xf0);
  }

// ****************
// * Compare s
// ****************
  function getCpARByteDefinition(rCode: RegisterCode) {
    return 0b10_111_000 + rCode;
  }

  cpu.registers.baseRegisters.forEach(register => {
    compareOperations.push({
      instruction: `CP ${register.name}`,
      byteDefinition: getCpARByteDefinition(register.code),
      cycleTime: 1,
      byteLength: 1,
      execute() {
        compareAndSetFlags(register.value, register.value);
        registers.programCounter.value += this.byteLength;
      }
    });
  });

  compareOperations.push({
    get instruction() {
      return `CP 0x${memory.readByte(registers.programCounter.value + 1).toString(16)}`;
    },
    byteDefinition: 0b11_111_110,
    cycleTime: 2,
    byteLength: 2,
    execute() {
      const value = memory.readByte(registers.programCounter.value + 1);
      compareAndSetFlags(registers.A.value, value);
      registers.programCounter.value += this.byteLength
    }
  });

  compareOperations.push({
    instruction: 'CP (HL)',
    byteDefinition: 0b10_111_110,
    cycleTime: 2,
    byteLength: 1,
    execute() {
      const value = memory.readByte(registers.HL.value);
      compareAndSetFlags(registers.A.value, value);
      registers.programCounter.value += this.byteLength
    }
  });

  return compareOperations;
}
