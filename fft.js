"use strict";

function rearrangeData(real, imag)
{
	let targetIndex = 0;
	const len = real.length;
	for(let i = 0; i < len; i++)
	{
		if(targetIndex > i)
		{
			const ri = real[i], ii = imag[i];
			real[i] = real[targetIndex];
			real[targetIndex] = ri;
			imag[i] = imag[targetIndex];
			imag[targetIndex] = ii;
		}

		let bitMask = len;
		while(targetIndex & (bitMask >>= 1))
			targetIndex &= ~bitMask;

		targetIndex |= bitMask;
	}
}

function rearrangeDataInterleaved(arr)
{
	let targetIndex = 0;
	const len = arr.length >> 1;
	for(let i = 0; i < len; i++)
	{
		if(targetIndex > i)
		{
			const i2 = i*2;
			const ri = arr[i2], ii = arr[i2+1];
			arr[i2] = arr[targetIndex];
			arr[targetIndex] = ri;
			arr[i2+1] = arr[targetIndex+1];
			arr[targetIndex+1] = ii;
		}

		let bitMask = len;
		while(targetIndex & (bitMask >>= 1))
			targetIndex &= ~bitMask;

		targetIndex |= bitMask;
	}
}

function makeTransform(real, imag, phase)
{
	let nextSine = 0;
	for(let i = 1; i < real.length; i <<= 1)
	{
		const next = i << 1;
		const multImag = nextSine;
		phase *= 0.5;
		nextSine = Math.sin(phase);
		const multReal = -2*nextSine*nextSine;
		let factorReal = 1, factorImag = 0;
		const realLen = real.length;
		for(let j = 0; j < i; j++) // iterations through groups with different transform factors
		{
			for(let k = j; k < realLen; k += next) // iterations through pairs within group
			{
				const match = k + i;
				const productReal = real[match] * factorReal - imag[match] * factorImag;
				const productImag = imag[match] * factorReal + real[match] * factorImag;
				real[match] = real[k] - productReal;
				imag[match] = imag[k] - productImag;
				real[k] += productReal;
				imag[k] += productImag;
			}
			const oldFactorReal = factorReal;
			factorReal = (multReal + 1)*factorReal - multImag*factorImag;
			factorImag = (multReal + 1)*factorImag + multImag*oldFactorReal;
		}
	}
}

function makeTransformInterleaved(arr, phase)
{
	let nextSine = 0;
	const len = arr.length >> 1;
	for(let i = 1; i < len; i <<= 1)
	{
		const i2 = i << 1;
		const multImag = nextSine;
		phase *= 0.5;
		nextSine = Math.sin(phase);
		const multReal = -2*nextSine*nextSine;
		let factorReal = 1, factorImag = 0;
		for(let j = 0; j < i; j++) // iterations through groups with different transform factors
		{
			for(let k = j; k < len; k += i2) // iterations through pairs within group
			{
				const k2 = k*2;
				const match2 = k2 + i2;
				const productReal = arr[match2] * factorReal - arr[match2+1] * factorImag;
				const productImag = arr[match2+1] * factorReal + arr[match2] * factorImag;
				arr[match2] = arr[k2] - productReal;
				arr[match2+1] = arr[k2+1] - productImag;
				arr[k2] += productReal;
				arr[k2+1] += productImag;
			}
			const oldFactorReal = factorReal;
			factorReal = (multReal + 1)*factorReal - multImag*factorImag;
			factorImag = (multReal + 1)*factorImag + multImag*oldFactorReal;
		}
	}
}

function InplaceFFT(real, imag)
{
	rearrangeData(real, imag);
	makeTransform(real, imag, -Math.PI);
	return {real, imag};
}

function InplaceInverseFFTNonNormalized(real, imag)
{
	rearrangeData(real, imag);
	makeTransform(real, imag, Math.PI);
	return {real, imag};
}

function InplaceInverseFFT(real, imag)
{
	InplaceInverseFFTNonNormalized(real, imag);
	const mul = 1.0/real.length;
	for(let i = 0; i < real.length; i++)
	{
		imag[i] *= mul;
		real[i] *= mul;
	}
	return {real, imag};
}

function InplaceInverseFFTNonNormalizedInterleaved(arr)
{
	rearrangeDataInterleaved(arr);
	makeTransformInterleaved(arr, Math.PI);
	return arr;
}

function InplaceInverseFFTInterleaved(arr)
{
	InplaceInverseFFTNonNormalizedInterleaved(arr);
	const mul = 2.0/arr.length;
	for(let i = 0; i < arr.length; i++)
		arr[i] *= mul;
	return arr;
}
